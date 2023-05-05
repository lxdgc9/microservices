import { RequestHandler } from "express";
import { BadReqErr } from "../../../err";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";

export const delPerm: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const perm = await Perm.findByIdAndDelete(
      req.params.id
    );
    if (!perm) {
      throw new BadReqErr("permission doesn't exist");
    }

    res.json({ msg: "delete successfully" });

    await PermGr.findByIdAndUpdate(perm.group, {
      $pull: { perms: perm._id },
    });
  } catch (e) {
    next(e);
  }
};
