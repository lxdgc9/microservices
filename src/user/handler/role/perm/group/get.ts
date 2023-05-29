import { RequestHandler } from "express";
import { Group } from "../../../../model/group";

export const getGroups: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      group: await Group.find().select("-perms"),
    });
  } catch (e) {
    next(e);
  }
};
