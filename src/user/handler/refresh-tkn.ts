import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { JwtPayload } from "@lxdgc9/pkg/dist/middie";
import { RequestHandler } from "express";
import { sign, verify } from "jsonwebtoken";
import { redis } from "../redis";

export const refreshTkn: RequestHandler = async (
  req,
  res,
  next
) => {
  const { token }: { token: string } = req.body;

  try {
    const { id, perms } = verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    if ((await redis.get(`rf-tkn.${id}`)) !== token) {
      throw new UnauthorizedErr(
        "require login, can't refresh token"
      );
    }

    const accessToken = sign(
      { id, perms },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 900 }
    );
    const refreshToken = sign(
      { id, perms },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: 36288000 }
    );

    res.json({ accessToken, refreshToken });

    await redis.set(`rf-tkn.${id}`, refreshToken, {
      EX: 36288001,
    });
  } catch (e) {
    next(e);
  }
};
