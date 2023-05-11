import { Document } from "mongoose";
import { Subject } from "../subject";

export interface ModUser {
  subject: Subject.MOD_USER;
  data: Document;
}
