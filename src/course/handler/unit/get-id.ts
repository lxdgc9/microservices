import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const getUnit: RequestHandler = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id).populate({
      path: "classes",
      populate: {
        path: "unit",
        select: "-classes",
      },
    });
    if (!unit) {
      throw new NotFoundErr("unit not found");
    }
    res.json({ unit });
  } catch (e) {
    next(e);
  }
};
