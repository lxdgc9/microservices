import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const getGroup: RequestHandler = async (_req, res, next) => {
  try {
    const group = await PermGr.find().select("-perms");
    res.json({ group });
  } catch (e) {
    next(e);
  }
};
