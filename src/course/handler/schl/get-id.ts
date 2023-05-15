import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Schl } from "../../model/schl";

export const getById: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const unit = await Schl.findById(req.params.id);
    if (!unit) {
      throw new NotFoundErr("unit not found");
    }

    res.json({ unit });
  } catch (e) {
    next(e);
  }
};
