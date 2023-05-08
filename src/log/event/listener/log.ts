import { Listener } from "@lxdgc9/pkg/dist/event/listener";
import { Logger } from "@lxdgc9/pkg/dist/event/log/logger";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";
import { model } from "mongoose";
import { Message } from "node-nats-streaming";
import { schema } from "../../schema";
import { qGroup } from "./qgroup";

export class LogListener extends Listener<Logger> {
  subject = Subject.Log;
  qGroup = qGroup;

  async onMsg(data: Logger["data"], msg: Message) {
    const { act, model: _model, status, doc, user } = data;

    const Model = model(_model, schema);
    const newDoc = new Model({
      act,
      status,
      doc,
      user,
    });
    await newDoc.save();

    msg.ack();
  }
}
