import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../../event/publisher/log";
import { Group } from "../../../../model/group";
import { Permission } from "../../../../model/permission";
import { nats } from "../../../../nats";

export const modGroup: RequestHandler = async (req, res, next) => {
  const {
    name,
    permIds,
  }: {
    name?: string;
    permIds?: Types.ObjectId[];
  } = req.body;
  try {
    const [group, numGrps] = await Promise.all([
      Group.findById(req.params.id),
      Permission.countDocuments({
        _id: {
          $in: permIds,
        },
      }),
    ]);
    if (!group) {
      throw new BadReqErr("group not found");
    }
    if (permIds && numGrps < permIds.length) {
      throw new BadReqErr("permIds mismatch");
    }

    await Promise.all([
      group.updateOne({
        $set: {
          name,
          permissions: permIds,
        },
      }),
      permIds &&
        Permission.deleteMany({
          _id: group.permissions.filter((p) => !permIds.includes(p)),
        }),
    ]);

    const [updGroup] = await Promise.all([
      Group.findById(group._id).populate({
        path: "perms",
        select: "-group",
      }),
      new LogPublisher(nats.cli).publish({
        act: "MOD",
        model: Group.modelName,
        doc: group,
        userId: req.user?.id,
        status: true,
      }),
    ]);

    res.json({ group: updGroup });
  } catch (e) {
    next(e);
  }
};
