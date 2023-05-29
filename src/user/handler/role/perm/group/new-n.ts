import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const newManyGroup: RequestHandler = async (req, res, next) => {
  const {
    names,
  }: {
    names: string[];
  } = req.body;
  try {
    await PermGr.insertMany(names);
    res.json({
      group: await PermGr.find({}).populate({
        path: "perms",
        select: "-group",
      }),
    });
  } catch (e) {
    next(e);
  }
};
