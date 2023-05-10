import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { UnauthorizedErr } from "../err";

export interface JwtPayload {
  id: Types.ObjectId;
  perms: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const decodeJwt: RequestHandler = (
  req,
  _res,
  next
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new UnauthorizedErr("require token"));
  }

  try {
    req.user = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    next();
  } catch (e) {
    next(e);
  }
};
