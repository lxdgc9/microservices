import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { DelManyUserPublisher } from "../event/publisher/user/del-s";
import { User } from "../model/user";
import { nats } from "../nats";

export const delUsers: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    userIds,
  }: {
    userIds: Types.ObjectId[];
  } = req.body;
  try {
    const users = await User.find({
      _id: { $in: userIds },
    });
    if (users.length < userIds.length) {
      throw new BadReqErr("users missmatch");
    }

    await User.deleteMany({ _id: userIds });

    await Promise.all([
      new DelManyUserPublisher(nats.cli).publish(userIds),
      new LogPublisher(nats.cli).publish({
        act: "DEL",
        model: User.modelName,
        doc: users,
        userId: req.user?.id,
        status: true,
      }),
    ]);

    res.json({ msg: "users deleted" });
  } catch (e) {
    next(e);
  }
};
