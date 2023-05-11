import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { DelUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../model/actor";
import { qGroup } from "../qgroup";

export class ModUserListener extends Listener<DelUser> {
  subject: Subject.DEL_USER = Subject.DEL_USER;
  qGroup = qGroup;

  async onMsg(data: DelUser["data"], msg: Message) {
    await Actor.findOneAndDelete({ userId: data.id });

    msg.ack();
  }
}
