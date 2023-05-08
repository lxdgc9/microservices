import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";

type Dto = {
  code?: string;
  desc?: string;
  groupId?: Types.ObjectId;
};

export const modPerm: RequestHandler = async (
  req,
  res,
  next
) => {
  const { code, desc, groupId }: Dto = req.body;
  try {
    const perm = await Perm.findById(req.params.id);
    if (!perm) {
      throw new BadReqErr("permission doesn't exist");
    }

    if (
      code !== perm.code &&
      (await Perm.find({ code })).length
    ) {
      throw new ConflictErr("code duplicated");
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
          code,
          desc,
          group: group._id,
        },
      });
    } else {
      await perm.updateOne({
        $set: {
          code,
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
