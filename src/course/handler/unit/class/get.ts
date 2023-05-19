import { RequestHandler } from "express";
import { Class } from "../../../model/class";

export const getClasses: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const classes = await Class.find().populate({
      path: "unit",
      select: "-classes",
    });
    res.json({ classes });
  } catch (e) {
    next(e);
  }
};
