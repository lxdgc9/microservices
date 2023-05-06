import { Message, Stan } from "node-nats-streaming";
import { Subject } from "./subject";

interface Event {
  subject: Subject;
  data: any;
}

export abstract class Listener<T extends Event> {
  protected cli: Stan;
  protected ackWait = 5000;

  abstract subject: T["subject"];
  abstract queueGrName: string;
  abstract onMsg(data: T["data"], msg: Message): void;

  constructor(cli: Stan) {
    this.cli = cli;
  }

  subOpts() {
    return this.cli
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGrName);
  }

  listen() {
    const sub = this.cli.subscribe(
      this.subject,
      this.queueGrName,
      this.subOpts()
    );

    sub.on("message", (msg: Message) => {
      console.log(
        `Msg received: ${this.subject} / ${this.queueGrName}`
      );

      this.onMsg(this.parseMsg(msg), msg);
    });
  }

  parseMsg(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
