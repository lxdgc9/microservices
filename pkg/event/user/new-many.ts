import { Document } from "mongoose";
import { Subject } from "../subject";

export interface NewManyUser {
  subject: Subject.NEW_MANY_USER;
  data: Document[];
}
