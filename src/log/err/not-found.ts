import { HttpErr } from "./http";

export class NotFoundErr extends HttpErr {
  constructor(msg: string) {
    super(404, msg);
    this.name = "Not Found";
  }
}
