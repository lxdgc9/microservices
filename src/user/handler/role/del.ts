import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../../event/publisher/log";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const delRole: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const role = await Role.findByIdAndDelete(
      req.params.id
    );
    if (!role) {
      throw new BadReqErr("role doesn't exist");
    }

    res.json({ msg: "delete successfully" });

    new LogPublisher(nats.cli).publish({
      act: "DEL",
      model: Role.modelName,
      doc: role,
      actorId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
