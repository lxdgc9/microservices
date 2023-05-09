import { Log } from "@lxdgc9/pkg/dist/event/log";
import { Publisher } from "@lxdgc9/pkg/dist/event/publisher";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";

export class LogPublisher extends Publisher<Log> {
  subject: Subject.LOG = Subject.LOG;
}
