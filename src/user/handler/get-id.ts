import { RequestHandler } from "express";
import { NotFoundErr } from "../err";
import { User } from "../model/user";

export const getUserById: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundErr("user doesn't exist");
    }
    res.json({ user });
  } catch (e) {
    next(e);
  }
};
