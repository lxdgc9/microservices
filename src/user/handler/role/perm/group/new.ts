import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const newGroup: RequestHandler = async (
  req,
  res,
  next
) => {
  const { name }: { name: string } = req.body;
  try {
    const group = new PermGr({ name });
    await group.save();
    res.json({ group });
  } catch (e) {
    next(e);
  }
};
