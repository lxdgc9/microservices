import { ErrorRequestHandler } from "express";
import { HttpErr } from "../err/http";

export const errHandler: ErrorRequestHandler = (
  e,
  _req,
  res,
  _next
) => {
  if (e instanceof HttpErr) {
    return res.status(e.code).send({ msg: e.message });
  }

  res.status(500).send({ msg: "Something went wrong" });
};
