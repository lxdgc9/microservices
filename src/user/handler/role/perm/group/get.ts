import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const getGroup: RequestHandler = (
  _req,
  res,
  next
) => {
  PermGr.find()
    .select("-perms")
    .then((group) => res.json({ group }))
    .catch(next);
};
