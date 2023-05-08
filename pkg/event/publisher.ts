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
    return new Promise<void>((resolve, reject) => {
      this.cli.publish(
        this.subject,
        JSON.stringify(data),
        (e) => {
          if (e) {
            return reject(e);
          }
          console.log(
            "Event published to subject",
            this.subject
          );
          resolve();
        }
      );
    });
  }
}
