import { RequestHandler } from "express";
import { Class } from "../../model/class";

export const getClasses: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const classes = await Class.find();
    res.json({ classes });
  } catch (e) {
    next(e);
  }
};
