import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { Unit } from "../../../model/unit";
import { User } from "../../../model/user";

export const newClass: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    name,
    unit,
    memberIds,
  }: {
    name: string;
    unit: string;
    memberIds: Types.ObjectId[];
  } = req.body;
  try {
    const [exitUnit, numMembers] = await Promise.all([
      Unit.exists({ _id: unit }),
      User.find({
        _id: {
          $in: memberIds,
        },
      }),
    ]);
    if (!exitUnit) {
      throw new BadReqErr("unit doesn't exist");
    }
    if (numMembers) {
      throw new BadReqErr("memberIds doesn't match");
    }

    const newClass = new Class({
      name,
      unit,
      members: memberIds,
    });
    await newClass.save();

    await Promise.all([
      Class.findById(newClass._id)
        .populate({
          path: "unit",
          select: "classes",
        })
        .then((_class) =>
          res.status(201).json({ class: _class })
        ),
      Unit.findByIdAndUpdate(newClass.unit, {
        $addToSet: {
          classes: newClass._id,
        },
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
