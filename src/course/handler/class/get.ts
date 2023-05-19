import { RequestHandler } from "express";
import { Class } from "../../model/class";

export const getClasses: RequestHandler = async (
  req,
  res,
  next
) => {
  const { cursor, size = 0 } = req.query;
  try {
    const classes = await Class.find(
      cursor ? { _id: { $lt: cursor } } : {}
    )
      .sort({ _id: -1 })
      .limit(parseInt(size.toString()))
      .populate("unit");
    res.json({ classes });
  } catch (e) {
    next(e);
  }
};
