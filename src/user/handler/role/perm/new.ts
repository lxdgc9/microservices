import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Group } from "../../../model/group";
import { Permission } from "../../../model/permission";
import { nats } from "../../../nats";

export const newPerm: RequestHandler = async (req, res, next) => {
  const {
    code,
    desc,
    groupId,
  }: {
    code: string;
    desc: string;
    groupId: Types.ObjectId;
  } = req.body;
  try {
    const [isDupl, group] = await Promise.all([
      Permission.exists({ code }),
      Group.findById(groupId),
    ]);
    if (isDupl) {
      throw new ConflictErr("code đã tồn tại");
    }
    if (!group) {
      throw new BadReqErr("không tìm thấy group");
    }

    const newPerm = new Permission({
      code,
      desc,
      group: groupId,
    });

    await Promise.all([
      newPerm.save(),
      group.updateOne({
        $addToSet: {
          permissions: newPerm._id,
        },
      }),
    ]);

    const perm = await Permission.findById(newPerm._id).populate({
      path: "group",
      select: "-perms",
    });

    res.status(201).send({ perm });

    await new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: Permission.modelName,
      doc: perm!,
      userId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
