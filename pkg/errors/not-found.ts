import { HttpError } from "./http";

export class NotFoundError extends HttpError {
  constructor(name: string = "not-found", message: string) {
    super(404, name, message);
  }
}
