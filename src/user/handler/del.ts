import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../event/publisher/log";
import { User } from "../model/user";
import { nats } from "../nats";

export const delUser: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("user doesn't exist");
    }

    res.json({ msg: "delete successfully" });

    new LogPublisher(nats.cli).publish({
      act: "DEL",
      model: User.modelName,
      doc: user,
      userId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
