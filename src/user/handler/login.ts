import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../model/user";
import { redis } from "../redis";

export const login: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    k,
    v,
    passwd,
  }: {
    k: string;
    v: string;
    passwd: string;
  } = req.body;

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
      throw new UnauthorizedErr("user doesn't exist");
    }

    const isMatch = await compare(passwd, user.passwd);
    if (!isMatch) {
      throw new UnauthorizedErr("wrong password");
    }

    const accessToken = sign(
      {
        id: user._id,
        perms: user.role.perms.map((p) => p.code),
        active: user.active,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 900 }
    );
    const refreshToken = sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: 36288000 }
    );

    res.json({
      user,
      accessToken,
      refreshToken,
    });

    await redis.set(`rf-tkn.${user._id}`, refreshToken, {
      EX: 36288001,
    });
  } catch (e) {
    next(e);
  }
};
