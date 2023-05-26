import { RequestHandler } from "express";

export const access: RequestHandler = (req, res, next) => {
  try {
    next();
  } catch (e) {
    next(e);
  }
};
