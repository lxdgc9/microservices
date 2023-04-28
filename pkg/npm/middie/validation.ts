import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { InvalidReqErr } from "../err/invalid-req";

export const validate: RequestHandler = (
  req,
  _res,
  next
) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    throw new InvalidReqErr(e.array()[0].msg);
  }
  next();
};
