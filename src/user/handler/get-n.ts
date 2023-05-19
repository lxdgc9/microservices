import { RequestHandler } from "express";
import { User } from "../model/user";

export const getUsers: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const users = await User.find(
      req.query.cursor
        ? {
            _id: { $lt: req.query.cursor },
          }
        : {}
    )
      .sort({ _id: -1 })
      .limit(parseInt((req.query.limit || 0).toString()))
      .populate({
        path: "role",
        select: "-perms",
      });
    res.json({ users });
  } catch (e) {
    next(e);
  }
};
