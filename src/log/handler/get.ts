import { RequestHandler } from "express";

export const getLogs: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
  } catch (e) {
    next(e);
  }
};
