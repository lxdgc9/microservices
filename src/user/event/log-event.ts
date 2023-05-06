import { Types } from "mongoose";
import { Subjects } from "./subjects";

export enum Actions {
  get = "GET",
  new = "CREATE",
  mod = "UPDATE",
  del = "DELETE",
}

interface LogEvent {
  subject: Subjects.Log;
  data: {
    userId?: Types.ObjectId;
    action: Actions;
    resource: string;
    documentId?: Types.ObjectId;
    success: boolean;
  };
}

export { LogEvent };
