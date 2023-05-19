import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { DelManyUser } from "@lxdgc9/pkg/dist/event/user";

export class DelManyUserPublisher extends Publisher<DelManyUser> {
  subject: Subject.DEL_MANY_USER = Subject.DEL_MANY_USER;
}
