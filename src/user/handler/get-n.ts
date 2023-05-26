import { RequestHandler } from "express";
import { User } from "../model/user";

export const getUsers: RequestHandler = async (req, res, next) => {
  const { cursor, limit = 0 } = req.query;
  try {
    const users = await User.find(
      cursor
        ? {
            _id: { $lt: cursor },
          }
        : {}
    )
      .sort({ _id: -1 })
      .limit(parseInt(limit.toString()))
      .populate({
        path: "role",
        select: "-perms",
      });
    res.json({ users });
  } catch (e) {
    next(e);
  }
};
