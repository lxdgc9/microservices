import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const newRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    permIds,
  }: {
    name: string;
    level: number;
    permIds: Types.ObjectId[];
  } = req.body;
  try {
    const numPerms = await Perm.countDocuments({
      _id: { $in: permIds },
    });
    if (numPerms < permIds.length) {
      throw new BadReqErr("permIds mismatch");
    }

    const newRole = new Role({
      name,
      level,
      perms: permIds,
    });
    await newRole.save();

    const role = await Role.findById(newRole._id).populate({
      path: "perms",
      select: "-group",
    });

    res.json({ role });

    await new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: Role.modelName,
      doc: role!,
      userId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
