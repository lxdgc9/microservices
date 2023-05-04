import { RequestHandler } from "express";
import { NotFoundErr } from "../../../err";
import { Perm } from "../../../model/perm";

export const getPermById: RequestHandler = async (req, res, next) => {
  try {
    const perm = await Perm.findById(req.params.id).populate("group");
    if (!perm) {
      throw new NotFoundErr("perm not found");
    }
    res.send({ perm });
  } catch (err) {
    next(err);
  }
};
