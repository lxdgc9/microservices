import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../model/user";
import { redis } from "../redis";

type Dto = {
  k: string;
  v: string;
  passwd: string;
};

export const login: RequestHandler = async (
  req,
  res,
  next
) => {
  const { k, v, passwd }: Dto = req.body;

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

    const isMatch = await compare(passwd, user.passwd);
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

    await redis.set(
      `rf-tkn.${payload.id.toString()}`,
      refreshToken,
      { EX: 36288001 }
    );
  } catch (e) {
    next(e);
  }
};
