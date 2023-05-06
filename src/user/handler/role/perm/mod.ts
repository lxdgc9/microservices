import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";

type Dto = {
  sign?: string;
  desc?: string;
  groupId?: Types.ObjectId;
};

export const modPerm: RequestHandler = async (
  req,
  res,
  next
) => {
  const { sign, desc, groupId }: Dto = req.body;
  try {
    const perm = await Perm.findById(req.params.id);
    if (!perm) {
      throw new BadReqErr("permission doesn't exist");
    }

    if (
      sign !== perm.sign &&
      (await Perm.find({ sign })).length
    ) {
      throw new ConflictErr("sign duplicated");
    }

    if (groupId && !perm.group.equals(groupId)) {
      const group = await PermGr.findById(groupId);
      if (!group) {
        throw new BadReqErr(
          "permission group doesn't exist"
        );
      }
      await Promise.all([
        group.updateOne({
          $addToSet: { perms: perm._id },
        }),
        PermGr.findByIdAndUpdate(perm.group, {
          $pull: { perms: perm._id },
        }),
      ]);
      await perm.updateOne({
        $set: {
          sign,
          desc,
          group: group._id,
        },
      });
    } else {
      await perm.updateOne({
        $set: {
          sign,
          desc,
        },
      });
    }

    res.json({
      perm: await Perm.findById(perm._id).populate({
        path: "group",
        select: "-perms",
      }),
    });
  } catch (e) {
    next(e);
  }
};
