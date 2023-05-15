import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const getUnits: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    res.json({ schools: await Unit.find() });
  } catch (e) {
    next(e);
  }
};
