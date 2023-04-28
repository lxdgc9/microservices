import { Subject } from "../subject";

export interface CreateUserSuccessEvent {
  subject: Subject.USER_CREATE_SUCC;
  data: {
    userId: string;
    username: string;
    password: string;
  };
}
