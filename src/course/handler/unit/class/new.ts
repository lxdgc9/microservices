import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { Unit } from "../../../model/unit";
import { User } from "../../../model/user";

export const newClass: RequestHandler = async (req, res, next) => {
  const {
    name,
    unit,
    memberIds,
  }: {
    name: string;
    unit: string;
    memberIds?: Types.ObjectId[];
  } = req.body;
  try {
    const [exUnit, numMembers] = await Promise.all([
      Unit.exists({ _id: unit }),
      User.countDocuments({
        _id: {
          $in: memberIds,
        },
      }),
    ]);
    if (!exUnit) {
      throw new BadReqErr("unit not found");
    }
    if (memberIds && numMembers < memberIds.length) {
      throw new BadReqErr("memberIds mismatch");
    }

    const newClass = new Class({
      name,
      unit,
      members: memberIds,
    });
    await newClass.save();

    const [_class] = await Promise.all([
      Class.findById(newClass._id).populate({
        path: "unit",
        select: "-classes",
      }),
      Unit.findByIdAndUpdate(newClass.unit, {
        $addToSet: {
          classes: newClass._id,
        },
      }),
      User.updateMany(
        {
          _id: {
            $in: memberIds,
          },
        },
        {
          $addToSet: {
            classes: newClass._id,
          },
        }
      ),
    ]);

    res.status(201).json({ class: _class });
  } catch (e) {
    next(e);
  }
};
