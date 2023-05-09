import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const delGroup: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const group = await PermGr.findByIdAndDelete(
      req.params.id
    );
    if (!group) {
      throw new BadReqErr("permission group doesn't exist");
    }

    res.json({ msg: "delete successfully" });

    Perm.deleteMany({ _id: group.perms });

    new LogPublisher(nats.cli).publish({
      act: "DEL",
      model: PermGr.modelName,
      doc: group,
      actorId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
