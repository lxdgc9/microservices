import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { ModUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../model/actor";
import { qGroup } from "../qgroup";

export class ModUserListener extends Listener<ModUser> {
  subject: Subject.MOD_USER = Subject.MOD_USER;
  qGroup = qGroup;

  async onMsg(data: ModUser["data"], msg: Message) {
    console.log(data.id);
    console.log(data);

    await Actor.findByIdAndUpdate(data.id, {
      ...data,
      role: (
        data as unknown as {
          role: { name: string };
        }
      ).role.name,
    });

    msg.ack();
  }
}
