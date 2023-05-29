import { HttpError } from "./http";

export class ForbiddenError extends HttpError {
  constructor(name: string = "forbidden", message: string) {
    super(403, name, message);
  }
}
