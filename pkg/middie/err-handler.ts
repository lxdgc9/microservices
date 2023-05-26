import { ErrorRequestHandler } from "express";
import { HttpErr } from "../err/http";

export const errHandler: ErrorRequestHandler = (e, _req, res, _next) => {
  console.log(e);
  if (e instanceof HttpErr) {
    return res.status(e.code).json({ msg: e.message });
  }

  if (["JsonWebTokenError", "TokenExpiredError"].includes(e.name)) {
    return res.status(400).json({ msg: e.message });
  }

  res.status(500).json({ msg: "something went wrong!!!" });
};
