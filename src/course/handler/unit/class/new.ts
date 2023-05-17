import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { Unit } from "../../../model/unit";

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
        .then((doc) =>
          res.status(201).json({ class: doc })
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
