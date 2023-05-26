import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../event/publisher/log";
import { DelUserPublisher } from "../event/publisher/user/del";
import { User } from "../model/user";
import { nats } from "../nats";

export const delUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new BadReqErr("user not found");
    }

    res.json({ msg: "deleted user" });

    await Promise.all([
      new DelUserPublisher(nats.cli).publish(user._id),
      new LogPublisher(nats.cli).publish({
        act: "DEL",
        model: User.modelName,
        doc: user,
        userId: req.user?.id,
        status: true,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
