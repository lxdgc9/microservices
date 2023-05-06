import { HttpErr } from "./http";

export class UnauthorizedErr extends HttpErr {
  constructor(msg: string) {
    super(401, msg);
    this.name = "Unauthorized";
  }
}
