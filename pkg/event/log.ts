import { Document, Types } from "mongoose";
import { Subject } from "./subject";

export interface Log {
  subject: Subject.LOG;
  data: {
    act: "GET" | "NEW" | "MOD" | "DEL";
    doc?: Document;
    userId?: Types.ObjectId;
    model: string;
    status: boolean;
  };
}
