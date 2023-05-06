import { HttpErr } from "./http";

export class InvalidReqErr extends HttpErr {
  constructor(msg: string) {
    super(400, msg);
    this.name = "Invalid Request";
  }
}
