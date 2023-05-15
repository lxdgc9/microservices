import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

export const delUnit: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new BadReqErr("unit doesn't exist");
    }

    res.json({ msg: "delete successfully" });
  } catch (e) {
    next(e);
  }
};
