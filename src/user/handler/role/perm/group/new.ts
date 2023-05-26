import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const newGroup: RequestHandler = async (req, res, next) => {
  const { name }: { name: string } = req.body;
  try {
    const group = new PermGr({ name });
    await group.save();

    res.status(201).json({ group });

    await new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: PermGr.modelName,
      doc: group,
      userId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
