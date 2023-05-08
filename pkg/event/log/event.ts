import { Types } from "mongoose";
import { Subject } from "../subject";

export interface Event {
  subject: Subject.Log;
  data: {
    act: "GET" | "NEW" | "MOD" | "DEL";
    model: string;
    status: boolean;
    docId?: Types.ObjectId;
    userId?: Types.ObjectId;
  };
}
