import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../model/class";
import { User } from "../../model/user";

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
    unit: Types.ObjectId;
    memberIds: Types.ObjectId[];
  } = req.body;
  try {
    const numMems = await User.countDocuments({
      _id: { $in: memberIds },
    });
    if (numMems < memberIds.length) {
      throw new BadReqErr("memberIds doesn't match");
    }

    const newClass = new Class({
      name,
      unit,
      members: memberIds,
    });
    await newClass.save();

    const _class = await Class.findById(
      newClass._id
    ).populate("unit");

    res.status(201).json({ class: _class });
  } catch (e) {
    next(e);
  }
};
