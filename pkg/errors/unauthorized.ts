import { HttpError } from "./http";

export class UnauthorizedError extends HttpError {
  constructor(name: string = "unauthorized", message: string) {
    super(401, name, message);
  }
}
