import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const getGroup: RequestHandler = async (_req, res, next) => {
  try {
    res.json({ group: await PermGr.find().select("-perms") });
  } catch (e) {
    next(e);
  }
};
