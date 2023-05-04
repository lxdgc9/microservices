import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../../../err";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";

type Dto = {
  sign: string;
  desc: string;
  groupId: Types.ObjectId;
};

export const newPerm: RequestHandler = async (req, res, next) => {
  const { sign, desc, groupId }: Dto = req.body;
  try {
    if (await Perm.findOne({ sign })) {
      throw new BadReqErr("perm already exists");
    }

    const permGr = await PermGr.findById(groupId);
    if (!permGr) {
      throw new BadReqErr("permGrId doesn't exist");
    }

    const perm = new Perm({
      sign,
      desc,
      group: permGr._id,
    });
    await perm.save();

    await permGr.updateOne({
      $addToSet: {
        perms: perm._id,
      },
    });

    const detail = await Perm.findById(perm._id).populate("group");

    res.status(201).send({ perm: detail });
  } catch (e) {
    next(e);
  }
};
