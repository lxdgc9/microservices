import { RequestHandler } from "express";
import { BadReqErr } from "../../../../err";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";

export const delGroup: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const group = await PermGr.findByIdAndDelete(
      req.params.id
    );
    if (!group) {
      throw new BadReqErr("permission group doesn't exist");
    }

    res.json({ msg: "delete successfully" });

    Perm.deleteMany({ _id: group.perms });
  } catch (e) {
    next(e);
  }
};
