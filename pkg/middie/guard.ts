import { RequestHandler } from "express";
import { ForbiddenErr } from "../err";

export function guard(...perms: string[]) {
  const allow: RequestHandler = (req, _res, next) => {
    if (req.user!.perms.some((p) => perms.includes(p))) {
      return next();
    }

    if (process.env.NODE_ENV === "dev") {
      return next();
    }

    next(new ForbiddenErr("permission denied"));
  };

  return allow;
}
