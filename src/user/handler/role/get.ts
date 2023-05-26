import { RequestHandler } from "express";
import { Role } from "../../model/role";

export const getRoles: RequestHandler = async (_req, res, next) => {
  try {
    const roles = await Role.find().sort({ _id: -1 }).populate({
      path: "perms",
      select: "-group",
    });
    res.json({ roles });
  } catch (e) {
    next(e);
  }
};
