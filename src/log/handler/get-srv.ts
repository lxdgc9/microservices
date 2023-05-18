import { RequestHandler } from "express";
import { connection } from "mongoose";

export const getSrv: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const services = (
      await connection.db.listCollections().toArray()
    ).map((c) => c.name);
    res.json({
      services,
    });
  } catch (e) {
    next(e);
  }
};
