import { RequestHandler } from "express";
import { User } from "../model/user";

export const getUsers: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    res.json({
      users: await User.find()
        .populate({
          path: "role",
          select: "-perms",
        })
        .sort({ createdAt: -1 }),
    });
  } catch (e) {
    next(e);
  }
};
