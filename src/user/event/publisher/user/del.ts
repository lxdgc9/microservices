import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { DelUser } from "@lxdgc9/pkg/dist/event/user";

export class DelUserPublisher extends Publisher<DelUser> {
  subject: Subject.DEL_USER = Subject.DEL_USER;
}
