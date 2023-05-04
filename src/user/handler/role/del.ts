import { RequestHandler } from "express";
import { BadReqErr } from "../../err";
import { Role } from "../../model/role";

export const delRole: RequestHandler = async (req, res, next) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      throw new BadReqErr("role does not exist");
    }

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
