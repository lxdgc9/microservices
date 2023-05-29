import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { ForbiddenError, UnauthorizedError } from "../errors";

export interface JwtPayload {
  id: Types.ObjectId;
  permissions: string[];
  isActive: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function guard(...perms: string[]) {
  const handler: RequestHandler = (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      if (process.env.NODE_ENV === "dev") {
        return next();
      }
      throw new UnauthorizedError();
    }

    try {
      req.user = verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
      if (!req.user.isActive) {
        throw new ForbiddenError("tài khoản bị chặn");
      }
      if (!req.user.permissions.some((p) => perms.includes(p))) {
        throw new ForbiddenError("từ chối quyền truy cập");
      }
      next();
    } catch (e) {
      next(e);
    }
  };

  return handler;
}
