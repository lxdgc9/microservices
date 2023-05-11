import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { ModUser } from "@lxdgc9/pkg/dist/event/user";

export class ModUserPublisher extends Publisher<ModUser> {
  subject: Subject.MOD_USER = Subject.MOD_USER;
}
