import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { connection, model } from "mongoose";
import { schema } from "../schema";

export const getLogs: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const models = (
      await connection.db.listCollections().toArray()
    ).map((c) => c.name);
    if (!models.includes(req.params.model)) {
      throw new BadReqErr("model doesn't exist");
    }

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
