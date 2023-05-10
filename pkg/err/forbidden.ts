import { HttpErr } from "./http";

export class ForbiddenErr extends HttpErr {
  constructor(msg: string) {
    super(403, msg);
    this.name = "Forbidden";
  }
}
