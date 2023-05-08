import { Logger } from "@lxdgc9/pkg/dist/event/log/logger";
import { Publisher } from "@lxdgc9/pkg/dist/event/publisher";
import { Subject } from "@lxdgc9/pkg/dist/event/subject";

export class LogPublisher extends Publisher<Logger> {
  subject = Subject.Log;
}
