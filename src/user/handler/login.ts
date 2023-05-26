import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../model/user";
import { redis } from "../redis";

export const login: RequestHandler = async (req, res, next) => {
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
        $elemMatch: { k, v },
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

    const match = await compare(passwd, user.passwd);
    if (!match) {
      throw new UnauthorizedErr("wrong password");
    }

    const atk = sign(
      {
        id: user._id,
        perms: user.role.perms.map((p) => p.code),
        active: user.active,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 900 }
    );
    const rtk = sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: 2592000,
    });

    res.json({
      user,
      accessToken: atk,
      refreshToken: rtk,
    });

    await redis.set(`rf-tkn.${user._id}`, rtk, { EX: 2592001 });
  } catch (e) {
    next(e);
  }
};
