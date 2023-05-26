import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { JwtPayload } from "@lxdgc9/pkg/dist/middie";
import { RequestHandler } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "../model/user";
import { redis } from "../redis";

export const rtk: RequestHandler = async (req, res, next) => {
  const { token }: { token: string } = req.body;
  try {
    const { id } = verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const storedTk = await redis.get(`rf-tkn.${id}`);
    if (storedTk !== token) {
      throw new UnauthorizedErr("can't refresh token, require login");
    }

    const user = await User.findById(id).populate<{
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
      expiresIn: 36288000,
    });

    res.json({
      accessToken: atk,
      refreshToken: rtk,
    });

    await redis.set(`rf-tkn.${id}`, rtk, { EX: 36288001 });
  } catch (e) {
    next(e);
  }
};
