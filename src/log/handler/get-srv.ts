import { RequestHandler } from "express";
import { connection } from "mongoose";

export const getSrv: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    res.json({
      srvs: (
        await connection.db.listCollections().toArray()
      ).map((c) => c.name),
    });
  } catch (e) {
    next(e);
  }
};
