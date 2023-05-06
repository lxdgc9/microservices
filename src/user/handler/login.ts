import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { UnauthorizedErr } from "../err";
import { User } from "../model/user";

type Dto = {
  k: string;
  v: string;
  password: string;
};

export const login: RequestHandler = async (
  req,
  res,
  next
) => {
  const { k, v, password }: Dto = req.body;

  try {
    const user = await User.findOne({
      attrs: {
        $elemMatch: { k: k, v: v },
      },
    }).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });
    if (!user) {
      throw new UnauthorizedErr("user not found");
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedErr("wrong password");
    }

    res.json({ user });
  } catch (e) {
    next(e);
  }
};
