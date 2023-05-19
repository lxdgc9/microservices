import { Types } from "mongoose";
import { Subject } from "./subject";

export interface Log {
  subject: Subject.LOG;
  data: {
    act: "GET" | "NEW" | "MOD" | "DEL";
    doc: any;
    model: string;
    status: boolean;
    userId?: Types.ObjectId;
  };
}
