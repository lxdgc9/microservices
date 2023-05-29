import { HttpError } from "./http";

export class ConflictError extends HttpError {
  constructor(name: string = "conflict", message: string) {
    super(409, name, message);
  }
}
