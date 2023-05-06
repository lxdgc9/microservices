import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validate: RequestHandler = (
  req,
  res,
  next
) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    return res.status(400).json({ errs: e.array() });
  }
  next();
};
