import { RequestHandler } from "express";
import { Schl } from "../../model/schl";

export const getSchls: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    res.json({ schools: await Schl.find() });
  } catch (e) {
    next(e);
  }
};
