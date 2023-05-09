import { Document } from "mongoose";
import { Subject } from "../subject";

export interface NewUser {
  subject: Subject.NEW_USER;
  data: {
    actor: Document;
  };
}
