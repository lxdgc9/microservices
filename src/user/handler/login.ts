import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { UnauthorizedErr } from "../err";
import { User } from "../model/user";

type Dto = {
  type: string;
  sign: string;
  password: string;
};

export const login: RequestHandler = async (
  req,
  res,
  next
) => {
  const { type, sign, password }: Dto = req.body;

  console.log(req.body);

  try {
    const user = await User.findOne({
      attrs: {
        $elemMatch: { k: type, v: sign },
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
