import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const getUnits: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const units = await Unit.find().sort({ createdAt: -1 });
    res.json({ units });
  } catch (e) {
    next(e);
  }
};
