import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Schl } from "../../model/schl";

export const delUnit: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const unit = await Schl.findById(req.params.id);
    if (!unit) {
      throw new BadReqErr("unit doesn't exist");
    }

    res.json({ msg: "delete successfully" });
  } catch (e) {
    next(e);
  }
};
