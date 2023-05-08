import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

type Dto = {
  name: string;
  permIds: Types.ObjectId[];
};

export const newRole: RequestHandler = async (
  req,
  res,
  next
) => {
  const { name, permIds }: Dto = req.body;

  try {
    const perms = await Perm.find({
      _id: { $in: permIds },
    });
    if (permIds.length < perms.length) {
      throw new BadReqErr("permIds doesn't match");
    }

    const role = new Role({
      name,
      perms: perms.map((p) => p._id),
    });
    await role.save();

    res.json({
      role: await Role.findById(role._id).populate({
        path: "perms",
        select: "-group",
      }),
    });

    new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: Role.modelName,
      status: true,
      doc: role._id,
      user: req.user!.id,
    });
  } catch (e) {
    next(e);
    new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: Role.modelName,
      status: false,
    });
  }
};
