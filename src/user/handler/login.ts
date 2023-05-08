import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
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
    }).populate<{
      role: {
        perms: {
          code: string;
        }[];
      };
    }>({
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

    const payload = {
      id: user._id,
      perms: user.role.perms.map((p) => p.code),
    };
    const accessToken = sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 900 }
    );
    const refreshToken = sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: 36288000 }
    );

    res.json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e);
  }
};
