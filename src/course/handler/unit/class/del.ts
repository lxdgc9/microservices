import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../../model/class";
import { Unit } from "../../../model/unit";

export const delClass: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const _class = await Class.findByIdAndDelete(
      req.params.id
    );
    if (!_class) {
      throw new BadReqErr("Class doesn't exist");
    }

    await Unit.findByIdAndUpdate(_class.unit, {
      $pull: {
        classes: _class._id,
      },
    });

    res.json({ msg: "delete successfully" });
  } catch (e) {
    next(e);
  }
};
