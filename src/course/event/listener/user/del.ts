import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { DelUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../model/user";
import { qGroup } from "../qgroup";

export class DelUserListener extends Listener<DelUser> {
  subject: Subject.DEL_USER = Subject.DEL_USER;
  qGroup = qGroup;

  async onMsg(data: DelUser["data"], msg: Message) {
    await User.findByIdAndDelete(data);

    msg.ack();
  }
}
