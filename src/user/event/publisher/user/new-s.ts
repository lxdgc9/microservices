import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { NewManyUser } from "@lxdgc9/pkg/dist/event/user";

export class NewManyUserPublisher extends Publisher<NewManyUser> {
  subject: Subject.NEW_MANY_USER = Subject.NEW_MANY_USER;
}
