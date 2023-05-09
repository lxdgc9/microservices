import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";
import { nats } from "../../nats";

type Dto = {
  name?: string;
  permIds?: Types.ObjectId[];
};

export const modRole: RequestHandler = async (
  req,
  res,
  next
) => {
  const { name, permIds }: Dto = req.body;
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      throw new BadReqErr("role doesn't exist");
    }

    if (permIds) {
      const perms = await Perm.find({
        _id: { $in: permIds },
      });
      if (perms.length < permIds.length) {
        throw new BadReqErr("permIds doesn't match");
      }
    }

    res.json({
      role: await Role.findByIdAndUpdate(
        role._id,
        {
          $set: {
            name,
            perms: permIds,
          },
        },
        { new: true }
      ).populate({
        path: "perms",
        select: "-group",
      }),
    });

    new LogPublisher(nats.cli).publish({
      act: "MOD",
      model: Role.modelName,
      doc: role,
      actorId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
