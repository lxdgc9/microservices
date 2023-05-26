import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { User } from "../model/user";

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });
    if (!user) {
      throw new NotFoundErr("user not found");
    }
    res.json({ user });
  } catch (e) {
    next(e);
  }
};
