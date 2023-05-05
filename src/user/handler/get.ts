import { RequestHandler } from "express";
import { User } from "../model/user";

export const getUsers: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const users = await User.find().populate("role");
    res.json({ users });
  } catch (e) {
    next(e);
  }
};
