import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const newGroup: RequestHandler = (
  req,
  res,
  next
) => {
  const { name }: { name: string } = req.body;

  const group = new PermGr({ name });
  group
    .save()
    .then(() => {
      res.status(201).json({ group });

      new LogPublisher(nats.cli).publish({
        act: "NEW",
        model: PermGr.modelName,
        doc: group,
        userId: req.user?.id,
        status: true,
      });
    })
    .catch(next);
};
