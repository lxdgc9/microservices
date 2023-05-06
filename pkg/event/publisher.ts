import { Stan } from "node-nats-streaming";
import { Subject } from "./subject";

interface Event {
  subject: Subject;
  data: any;
}

export abstract class Publisher<T extends Event> {
  protected cli: Stan;

  abstract subject: T["subject"];

  constructor(cli: Stan) {
    this.cli = cli;
  }

  async publish(data: T["data"]) {
    try {
      this.cli.publish(this.subject, JSON.stringify(data));
      console.log(
        "Event published to subject",
        this.subject
      );
    } catch (e) {
      throw e;
    }
  }
}
