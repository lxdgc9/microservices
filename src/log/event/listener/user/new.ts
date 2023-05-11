import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { NewUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../model/actor";
import { qGroup } from "../qgroup";

export class NewUserListener extends Listener<NewUser> {
  subject: Subject.NEW_USER = Subject.NEW_USER;
  qGroup = qGroup;

  async onMsg(data: NewUser["data"], msg: Message) {
    const newActor = new Actor({
      userId: data.id,
      obj: data,
    });
    newActor.save();

    msg.ack();
  }
}
