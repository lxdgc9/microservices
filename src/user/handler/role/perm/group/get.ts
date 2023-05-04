import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const getPermGr: RequestHandler = async (_req, res, next) => {
  try {
    const permGr = await PermGr.find().select("-perms");
    res.send({ permGr });
  } catch (e) {
    next(e);
  }
};
