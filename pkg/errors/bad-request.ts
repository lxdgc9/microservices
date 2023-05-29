import { HttpError } from "./http";

export class BadRequestError extends HttpError {
  constructor(name: string = "bad-request", message: string) {
    super(400, name, message);
  }
}
