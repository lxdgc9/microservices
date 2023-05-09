import { RequestHandler } from "express";
import { model } from "mongoose";
import { schema } from "../schema";

export const getLogs: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const log = await model(req.params.model, schema)
      .find()
      .populate({
        path: "actor",
        select: "obj",
      });
    res.json({ log });
  } catch (e) {
    next(e);
  }
};
