import { RequestHandler } from "express";
import { Role } from "../../model/role";

export const getRoles: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    res.json({
      roles: await Role.find()
        .populate({
          path: "perms",
          select: "-group",
        })
        .sort({ createdAt: -1 }),
    });
  } catch (e) {
    next(e);
  }
};
