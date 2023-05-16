import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
import { Unit } from "../../model/unit";

export const delUnit: RequestHandler = (req, res, next) => {
  Unit.findByIdAndDelete(req.params.id)
    .then((doc) => {
      if (!doc) {
        throw new BadReqErr("unit doesn't exist");
      }

      if (doc.logo) {
        rmSync(doc.logo.replace("/api/courses/", ""));
      }

      res.json({ msg: "delete successfully" });
    })
    .catch(next);
};
