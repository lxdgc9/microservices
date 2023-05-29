import { RequestHandler } from "express";
import { Group } from "../../../../model/group";

export const newGroups: RequestHandler = async (req, res, next) => {
  const { names }: { names: string[] } = req.body;

  try {
    await Group.insertMany(names.map((n) => ({ name: n })));

    res.status(201).json({
      groups: await Group.find().populate({
        path: "perms",
        select: "-group",
      }),
    });
  } catch (e) {
    next(e);
  }
};
