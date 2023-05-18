import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const modPerm: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    code,
    desc,
    groupId,
  }: {
    code?: string;
    desc?: string;
    groupId?: Types.ObjectId;
  } = req.body;
  try {
    const perm = await Perm.findById(req.params.id);
    if (!perm) {
      throw new BadReqErr("permission doesn't exist");
    }

    const [isDupl, existGr] = await Promise.all([
      Perm.exists({ code }),
      PermGr.exists({ _id: groupId }),
    ]);
    if (code && isDupl) {
      throw new ConflictErr("code duplicated");
    }
    if (groupId && !existGr) {
      throw new BadReqErr("permission group doesn't exist");
    }

    if (groupId && !perm.group.equals(groupId)) {
      await Promise.all([
        PermGr.findByIdAndUpdate(groupId, {
          $addToSet: { perms: perm._id },
        }),
        PermGr.findByIdAndUpdate(perm.group, {
          $pull: { perms: perm._id },
        }),
      ]);
    }

    await perm.updateOne({
      $set: {
        code,
        desc,
        group: groupId,
      },
    });

    const [updPerm] = await Promise.all([
      Perm.findById(perm._id).populate({
        path: "group",
        select: "-perms",
      }),
      new LogPublisher(nats.cli).publish({
        act: "MOD",
        model: Perm.modelName,
        doc: perm,
        userId: req.user?.id,
        status: true,
      }),
    ]);

    res.json({ perm: updPerm });
  } catch (e) {
    next(e);
  }
};
