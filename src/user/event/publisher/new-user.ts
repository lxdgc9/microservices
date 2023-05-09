import { Publisher } from "@lxdgc9/pkg/dist/event/publisher";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";
import { NewUser } from "@lxdgc9/pkg/dist/event/user/new";

export class NewUserPublisher extends Publisher<NewUser> {
  subject: Subject.NEW_USER = Subject.NEW_USER;
}
