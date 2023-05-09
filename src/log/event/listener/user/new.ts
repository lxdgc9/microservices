import { Listener } from "@lxdgc9/pkg/dist/event/listener";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";
import { NewUser } from "@lxdgc9/pkg/dist/event/user/new";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../model/actor";
import { qGroup } from "../qgroup";

export class NewUserListener extends Listener<NewUser> {
  subject: Subject.NEW_USER = Subject.NEW_USER;
  qGroup = qGroup;

  async onMsg(data: NewUser["data"], msg: Message) {
    const { actor } = data;

    const newActor = new Actor({
      act: actor.id,
      obj: actor,
    });
    newActor.save();

    msg.ack();
  }
}
