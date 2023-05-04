export class HttpErr extends Error {
  readonly code: number;

  constructor(code: number, msg: string) {
    super(msg);
    this.code = code;
    this.name = "Error";
  }
}
