import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { connection, model } from "mongoose";
import { schema } from "../schema";

export const getLogs: RequestHandler = async (
  req,
  res,
  next
) => {
  console.log("hello world");
  try {
    const srvs = (
      await connection.db.listCollections().toArray()
    ).map((c) => c.name);
    if (!srvs.includes(req.params.srv)) {
      throw new BadReqErr("service doesn't exist");
    }

    res.json({
      log: await model(req.params.srv, schema)
        .find()
        .populate({
          path: "actor",
          select: "obj",
        }),
    });
  } catch (e) {
    next(e);
  }
};
