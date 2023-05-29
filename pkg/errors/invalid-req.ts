import { HttpError } from "./http";

export class InvalidRequestError extends HttpError {
  constructor(name: string = "invalid-request", message: string) {
    super(400, name, message);
  }
}
