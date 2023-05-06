import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Role } from "../../model/role";

export const delRole: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const role = await Role.findByIdAndDelete(
      req.params.id
    );
    if (!role) {
      throw new BadReqErr("role doesn't exist");
    }

    res.json({ msg: "delete successfully" });
  } catch (e) {
    next(e);
  }
};
