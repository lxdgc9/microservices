import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../model/class";
import { User } from "../../model/user";

type Dto = {
  name: string;
  memberIds: Types.ObjectId[];
};

export const newClass: RequestHandler = async (
  req,
  res,
  next
) => {
  const { name, memberIds }: Dto = req.body;

  try {
    const users = await User.find({
      _id: { $in: memberIds },
    });
    if (users.length < memberIds.length) {
      throw new BadReqErr("memberIds doesn't match");
    }

    const newClass = new Class({
      name,
      members: memberIds,
    });
    await newClass.save();

    res.status(201).json({ class: newClass });
  } catch (e) {
    next(e);
  }
};
