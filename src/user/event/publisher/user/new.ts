import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { NewUser } from "@lxdgc9/pkg/dist/event/user";

export class NewUserPublisher extends Publisher<NewUser> {
  subject: Subject.NEW_USER = Subject.NEW_USER;
}
