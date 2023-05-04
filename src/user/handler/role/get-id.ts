import { RequestHandler } from "express";
import { NotFoundErr } from "../../err";
import { Role } from "../../model/role";

export const getRoleById: RequestHandler = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id).populate({
      path: "perms",
      select: "-group",
    });
    if (!role) {
      throw new NotFoundErr("role not found");
    }
    res.send({ role });
  } catch (e) {
    next(e);
  }
};
