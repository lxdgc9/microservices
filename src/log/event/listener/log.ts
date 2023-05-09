import { Listener } from "@lxdgc9/pkg/dist/event/listener";
import { Log } from "@lxdgc9/pkg/dist/event/log";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";
import { model } from "mongoose";
import { Message } from "node-nats-streaming";
import { schema } from "../../schema";
import { qGroup } from "./qgroup";

export class LogListener extends Listener<Log> {
  subject: Subject.LOG = Subject.LOG;
  qGroup = qGroup;

  async onMsg(data: Log["data"], msg: Message) {
    const {
      act,
      doc,
      actorId,
      model: _model,
      status,
    } = data;

    const Model = model(_model, schema);
    const newDoc = new Model({
      act,
      doc,
      actor: actorId,
      status,
    });
    await newDoc.save();

    msg.ack();
  }
}
