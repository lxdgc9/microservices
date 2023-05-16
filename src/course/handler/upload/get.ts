import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { createReadStream, existsSync } from "fs";
import { join } from "path";

export const getFile: RequestHandler = (req, res, next) => {
  const file = join("uploads", req.params[0]);

  try {
    if (!existsSync(file)) {
      throw new NotFoundErr("file not found");
    }

    const stream = createReadStream(file);
    stream.pipe(res);
  } catch (e) {
    next(e);
  }
};
