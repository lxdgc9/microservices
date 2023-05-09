import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const newGroup: RequestHandler = async (
  req,
  res,
  next
) => {
  const { name }: { name: string } = req.body;
  try {
    const group = new PermGr({ name });
    await group.save();

    new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: PermGr.modelName,
      doc: group,
      actorId: req.user?.id,
      status: true,
    });
    res.json({ group });
  } catch (e) {
    next(e);
  }
};
