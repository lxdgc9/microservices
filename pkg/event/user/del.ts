import { Document } from "mongoose";
import { Subject } from "../subject";

export interface DelUser {
  subject: Subject.DEL_USER;
  data: Document;
}
