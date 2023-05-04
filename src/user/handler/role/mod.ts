import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../../err";
import { Perm } from "../../model/perm";
import { Role } from "../../model/role";

type Dto = {
  name: string;
  permIds: Types.ObjectId[];
};

export const modRole: RequestHandler = async (req, res, next) => {
  const { name, permIds }: Dto = req.body;
  try {
    const perms = await Perm.find({ _id: permIds });
    if (permIds.length < perms.length) {
      throw new BadReqErr("invalid permIds");
    }

    const role = await Role.findByIdAndUpdate(req.params.id, {
      name,
      perms: perms.map((p) => p._id),
    });
    if (!role) {
      throw new BadReqErr("role does not exist");
    }

    const detail = await Role.findById(role._id).populate({
      path: "perms",
      select: "-group",
    });

    res.send({ role: detail });
  } catch (e) {
    next(e);
  }
};
