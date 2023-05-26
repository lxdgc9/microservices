import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const getUnits: RequestHandler = async (req, res, next) => {
  const { cursor, size = 0 } = req.query;
  try {
    const units = await Unit.find(cursor ? { _id: { $lt: cursor } } : {})
      .sort({ _id: -1 })
      .limit(parseInt(size.toString()))
      .populate({
        path: "classes",
        select: "-unit",
      });
    res.json({ units });
  } catch (e) {
    next(e);
  }
};
