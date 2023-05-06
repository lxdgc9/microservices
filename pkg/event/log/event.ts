import { Types } from "mongoose";
import { Subject } from "../subject";

interface Event {
  subject: Subject.Log;
  data: {
    act: "GET" | "NEW" | "MOD" | "DEL";
    model: string;
    status: boolean;
    docId?: Types.ObjectId;
    userId?: Types.ObjectId;
  };
}

export { Event };
