import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../../err";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";

type Dto = {
  name: string;
  permIds: Types.ObjectId[];
};

export const newRole: RequestHandler = async (req, res, next) => {
  const { name, permIds }: Dto = req.body;

  try {
    const perms = await Perm.find({ _id: permIds });
    if (permIds.length < perms.length) {
      throw new BadReqErr("invalid permIds");
    }

    const role = new Role({
      name,
      perms: perms.map((p) => p._id),
    });
    await role.save();

    res.send({ role });
  } catch (err) {
    next(err);
  }
};
