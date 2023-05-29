export class HttpError extends Error {
  readonly code: number;

  constructor(code: number, name: string = "error", msg: string) {
    super(msg);
    this.code = code;
    this.name = name;
  }
}
