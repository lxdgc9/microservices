import { RequestHandler } from "express";
import { PermGr } from "../../../model/perm-gr";

export const getPerms: RequestHandler = async (_req, res, next) => {
  try {
    const perms = await PermGr.find().populate({
      path: "perms",
      select: "-group",
    });
    res.send({ perms });
  } catch (err) {
    next(err);
  }
};
