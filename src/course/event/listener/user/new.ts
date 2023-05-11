import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { NewUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../model/user";
import { qGroup } from "../qgroup";

export class NewUserListener extends Listener<NewUser> {
  subject: Subject.NEW_USER = Subject.NEW_USER;
  qGroup = qGroup;

  async onMsg(data: NewUser["data"], msg: Message) {
    const newUser = new User({
      ...data,
      userId: data.id,
      role: (
        data as unknown as {
          role: { name: string };
        }
      ).role.name,
    });
    newUser.save();

    msg.ack();
  }
}
