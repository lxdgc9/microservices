import { Event } from "@lxdgc9/pkg/dist/event/log/event";
import { Publisher } from "@lxdgc9/pkg/dist/event/publisher";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";

export class LogPublisher extends Publisher<Event> {
  subject: Subject.Log = Subject.Log;
}
