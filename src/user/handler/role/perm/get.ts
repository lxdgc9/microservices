import { RequestHandler } from "express";
import { PermGr } from "../../../model/perm-gr";

export const getPerms: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    res.json({
      perms: await PermGr.find().populate({
        path: "perms",
        select: "-group",
      }),
    });
  } catch (e) {
    next(e);
  }
};
