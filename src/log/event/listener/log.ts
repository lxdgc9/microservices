import { Listener } from "@lxdgc9/pkg/dist/event/listener";
import { Logger } from "@lxdgc9/pkg/dist/event/log/logger";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";
import { Message } from "node-nats-streaming";
import { qGroup } from "./qgroup";

export class LogListener extends Listener<Logger> {
  subject = Subject.Log;
  qGroup = qGroup;

  async onMsg(data: Logger["data"], msg: Message) {
    const { act, model, status, docId, userId } = data;

    console.log(data);

    // ack the message
    msg.ack();
  }
}
