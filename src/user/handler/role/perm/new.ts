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

type Dto = {
  code: string;
  desc: string;
  groupId: Types.ObjectId;
};

export const newPerm: RequestHandler = async (
  req,
  res,
  next
) => {
  const { code, desc, groupId }: Dto = req.body;

  try {
    const perm = await Perm.findOne({ code });
    if (perm) {
      throw new ConflictErr("permission already exists");
    }

    const group = await PermGr.findById(groupId);
    if (!group) {
      throw new BadReqErr("permission group doesn't exist");
    }

    const newPerm = new Perm({
      code,
      desc,
      group: group._id,
    });
    await newPerm.save();

    await group.updateOne({
      $addToSet: { perms: newPerm._id },
    });

    const detail = await Perm.findById(
      newPerm._id
    ).populate({
      path: "group",
      select: "-perms",
    });

    res.status(201).send({ perm: detail });

    new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: Perm.modelName,
      doc: detail!,
      actorId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
