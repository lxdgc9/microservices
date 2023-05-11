import { Types } from "mongoose";
import { Subject } from "../subject";

export interface ModUser {
  subject: Subject.MOD_USER;
  data: Types.ObjectId;
}
