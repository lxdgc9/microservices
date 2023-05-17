import { RequestHandler } from "express";
import { User } from "../model/user";

export const getUsers: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const users = await User.find()
      .sort({ _id: -1 })
      .populate({
        path: "role",
        select: "-perms",
      });
    res.json({ users });
  } catch (e) {
    next(e);
  }
};
