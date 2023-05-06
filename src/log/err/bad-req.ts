import { HttpErr } from "./http";

export class BadReqErr extends HttpErr {
  constructor(msg: string) {
    super(400, msg);
    this.name = "Bad Request";
  }
}
