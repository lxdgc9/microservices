import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const getUnits: RequestHandler = (
  _req,
  res,
  next
) => {
  Unit.find()
    .then((units) => res.json({ units }))
    .catch(next);
};
