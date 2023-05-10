import { RequestHandler } from "express";
import { ForbiddenErr } from "../err";

export function guard(...perms: string[]) {
  const allow: RequestHandler = (req, _res, next) => {
    if (process.env.NODE_ENV === "dev") {
      return next();
    }

    try {
      if (req.user!.perms.some((p) => perms.includes(p))) {
        return next();
      }

      throw new ForbiddenErr("permission denied");
    } catch (e) {
      next(e);
    }
  };

  return allow;
}
