import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { User } from "../model/user";

export const delUser: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("user doesn't exist");
    }

    res.json({ msg: "delete successfully" });
  } catch (e) {
    next(e);
  }
};
