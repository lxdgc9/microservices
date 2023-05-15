import { RequestHandler } from "express";
import { Types } from "mongoose";

type Dto = {
  name: string;
  memberIds: Types.ObjectId[];
};

export const newClass: RequestHandler = async (
  req,
  res,
  next
) => {
  const {}: Dto = req.body;

  try {
  } catch (e) {
    next(e);
  }
};
