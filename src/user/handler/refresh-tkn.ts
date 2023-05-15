import { UnauthorizedErr } from "@lxdgc9/pkg/dist/err";
import { JwtPayload } from "@lxdgc9/pkg/dist/middie";
import { RequestHandler } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "../model/user";
import { redis } from "../redis";

export const refreshTkn: RequestHandler = async (
  req,
  res,
  next
) => {
  const { token }: { token: string } = req.body;

  try {
    const { id } = verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    if ((await redis.get(`rf-tkn.${id}`)) !== token) {
      throw new UnauthorizedErr(
        "require login, can't refresh token"
      );
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
      throw new UnauthorizedErr("user doesn't exist");
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

    res.json({ accessToken, refreshToken });

    await redis.set(`rf-tkn.${id}`, refreshToken, {
      EX: 36288001,
    });
  } catch (e) {
    next(e);
  }
};
