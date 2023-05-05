import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../../../err";
import { ConflictErr } from "../../../err/confict";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";

type Dto = {
  sign: string;
  desc: string;
  groupId: Types.ObjectId;
};

export const newPerm: RequestHandler = async (
  req,
  res,
  next
) => {
  const { sign, desc, groupId }: Dto = req.body;

  try {
    const perm = await Perm.findOne({ sign });
    if (perm) {
      throw new ConflictErr("permission already exists");
    }

    const group = await PermGr.findById(groupId);
    if (!group) {
      throw new BadReqErr("permission group doesn't exist");
    }

    const newPerm = new Perm({
      sign,
      desc,
      group: group._id,
    });
    await newPerm.save();

    await group.updateOne({
      $addToSet: { perms: newPerm._id },
    });

    res.status(201).send({
      perm: await Perm.findById(newPerm._id).populate(
        "group"
      ),
    });
  } catch (e) {
    next(e);
  }
};
