import { Types } from "mongoose";
import { Subject } from "../subject";

export interface DelManyUser {
  subject: Subject.DEL_MANY_USER;
  data: Types.ObjectId[];
}
