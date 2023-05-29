import { RequestHandler } from "express";
import { Group } from "../../../model/group";

export const getPerms: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      perms: await Group.find().populate({
        path: "perms",
        select: "-group",
      }),
    });
  } catch (e) {
    next(e);
  }
};
