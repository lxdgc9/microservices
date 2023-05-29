import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Group } from "../../../../model/group";

export const delManyGroup: RequestHandler = async (req, res, next) => {
  const {
    groupIds,
  }: {
    groupIds: Types.ObjectId[];
  } = req.body;
  try {
    const groups = await Group.deleteMany({ _id: groupIds });

    console.log(groups);

    res.json({ msg: "deleted groups" });
  } catch (e) {
    next(e);
  }
};
