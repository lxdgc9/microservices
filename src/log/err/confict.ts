import { HttpErr } from "./http";

export class ConflictErr extends HttpErr {
  constructor(msg: string) {
    super(409, msg);
    this.name = "Conflict";
  }
}
