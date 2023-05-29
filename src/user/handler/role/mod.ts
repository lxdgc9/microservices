import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../event/publisher/log";
import { Permission } from "../../model/permission";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const modRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    permIds,
  }: {
    name?: string;
    level?: number;
    permIds?: Types.ObjectId[];
  } = req.body;
  try {
    const [role, numPerms] = await Promise.all([
      Role.findById(req.params.id),
      Permission.countDocuments({
        _id: { $in: permIds },
      }).then((perms) => perms),
    ]);
    if (!role) {
      throw new BadReqErr("role not found");
    }
    if (permIds && numPerms < permIds.length) {
      throw new BadReqErr("permIds mismatch");
    }

    const updRole = await Role.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          level,
          permissions: permIds,
        },
      },
      { new: true }
    ).populate({
      path: "perms",
      select: "-group",
    });

    res.json({ role: updRole });

    await new LogPublisher(nats.cli).publish({
      act: "MOD",
      model: Role.modelName,
      doc: role,
      userId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
