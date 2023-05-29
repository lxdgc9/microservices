import { RequestHandler } from "express";
import { Types } from "mongoose";
import { PermGr } from "../../../../model/perm-gr";

export const delManyGroup: RequestHandler = async (req, res, next) => {
  const {
    groupIds,
  }: {
    groupIds: Types.ObjectId[];
  } = req.body;
  try {
    const groups = await PermGr.deleteMany({ _id: groupIds });

    console.log(groups);

    res.json({ msg: "deleted groups" });
  } catch (e) {
    next(e);
  }
};
