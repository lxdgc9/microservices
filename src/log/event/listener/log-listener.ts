import { Message } from "node-nats-streaming";
import { Listener } from "../base-listener";
import { LogEvent } from "../log-event";
import { Subjects } from "../subjects";
import { queueGroupName } from "./queue-group-name";

class LogListener extends Listener<LogEvent> {
  subject: Subjects = Subjects.Log;
  queueGroupName = queueGroupName;

  async onMessage(data: LogEvent["data"], msg: Message) {
    const { userId } = data;

    console.log(data);

    // const user = await User.findById(userId);
    // if (user) {
    //   await Profile.findByIdAndDelete(user.profile);
    //   await UserFilter.findOneAndDelete({ userId: user.id });
    //   await user.delete();
    // }

    // ack the message
    msg.ack();
  }
}

export { LogListener };
