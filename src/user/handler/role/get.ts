import { RequestHandler } from "express";
import { Role } from "../../model/role";

export const getRoles: RequestHandler = async (_req, res, next) => {
  try {
    const roles = await Role.find()
      .populate({
        path: "perms",
        select: "-group",
      })
      .sort({ createdAt: -1 });
    res.send({ roles });
  } catch (e) {
    next(e);
  }
};
