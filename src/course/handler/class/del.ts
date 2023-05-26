import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../model/class";

export const delClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findByIdAndDelete(req.params.id);
    if (!_class) {
      throw new BadReqErr("class doesn't exist");
    }

    res.json({ msg: "delete successfully" });
  } catch (e) {
    next(e);
  }
};
