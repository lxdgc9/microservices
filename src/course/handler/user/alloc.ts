import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { User } from "../../model/user";

export const allocUser: RequestHandler = async (
  req,
  res,
  next
) => {
  console.log("go here", req.params);
  try {
    const user = await User.findOne({
      userId: req.params.userId,
    });
    if (!user) {
      throw new BadReqErr("user doesn't exist");
    }
    res.json({ user });
  } catch (e) {
    next(e);
  }
};
