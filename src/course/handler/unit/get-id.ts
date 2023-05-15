import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const getUnitById: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new NotFoundErr("unit not found");
    }

    res.json({ unit });
  } catch (e) {
    next(e);
  }
};
