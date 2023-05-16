import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const getUnit: RequestHandler = (req, res, next) => {
  Unit.findById(req.params.id)
    .then((unit) => {
      if (!unit) {
        throw new NotFoundErr("unit not found");
      }
      res.json({ unit });
    })
    .catch(next);
};
