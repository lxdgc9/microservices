import { Publisher } from "../base-publisher";
import { LogEvent } from "../log-event";
import { Subjects } from "../subjects";

class LogPublisher extends Publisher<LogEvent> {
  subject: Subjects.Log = Subjects.Log;
}

export { LogPublisher };
