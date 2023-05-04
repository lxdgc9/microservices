import { RequestHandler } from "express";
import { BadReqErr } from "../../../../err";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";

export const delPermGr: RequestHandler = async (req, res, next) => {
  try {
    const permGr = await PermGr.findByIdAndDelete(req.params.id);
    if (!permGr) {
      throw new BadReqErr("permGr doesn't exist");
    }

    await Perm.deleteMany({ _id: permGr.perms });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
