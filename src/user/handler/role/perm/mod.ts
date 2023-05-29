import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Group } from "../../../model/group";
import { Permission } from "../../../model/permission";
import { nats } from "../../../nats";

export const modPerm: RequestHandler = async (req, res, next) => {
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
    const perm = await Permission.findById(req.params.id);
    if (!perm) {
      throw new BadReqErr("không tìm thấy permission");
    }

    const [isDupl, exGrp] = await Promise.all([
      Permission.exists({ code }),
      Group.exists({ _id: groupId }),
    ]);
    if (code && isDupl) {
      throw new ConflictErr("duplicate code");
    }
    if (groupId && !exGrp) {
      throw new BadReqErr("không tìm thấy group");
    }

    if (groupId && !perm.group?.equals(groupId)) {
      await Promise.all([
        Group.findByIdAndUpdate(groupId, {
          $addToSet: { permissions: perm._id },
        }),
        Group.findByIdAndUpdate(perm.group, {
          $pull: { permissions: perm._id },
        }),
      ]);
    }

    await perm.updateOne({
      $set: {
        code,
        description: desc,
        group: groupId,
      },
    });

    const [updPerm] = await Promise.all([
      Permission.findById(perm._id).populate({
        path: "group",
        select: "-perms",
      }),
      new LogPublisher(nats.cli).publish({
        act: "MOD",
        model: Permission.modelName,
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
