import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { createReadStream, existsSync } from "fs";
import { join, resolve } from "path";

export const getFile: RequestHandler = (req, res, next) => {
  try {
    const file = join(resolve(), "upload", req.params[0]);
    if (!existsSync(file)) {
      throw new NotFoundErr("file not found");
    }

    const stream = createReadStream(file);
    stream.pipe(res);
  } catch (e) {
    next(e);
  }
};
