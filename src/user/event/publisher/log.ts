import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { Log } from "@lxdgc9/pkg/dist/event/log";

export class LogPublisher extends Publisher<Log> {
  subject: Subject.LOG = Subject.LOG;
}
