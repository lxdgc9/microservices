import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

type Dto = {
  name: string;
};

export const newPermGr: RequestHandler = async (req, res, next) => {
  const { name }: Dto = req.body;
  try {
    const permGr = new PermGr({ name });
    await permGr.save();
    res.json({ permGr });
  } catch (e) {
    next(e);
  }
};
