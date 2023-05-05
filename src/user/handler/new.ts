import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../err";
import { Role } from "../model/role";
import { User } from "../model/user";

type Dto = {
  password: string;
  prof: Record<string, string>;
  role: Types.ObjectId;
  active?: boolean;
};

export const newUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const { password, prof, role, active }: Dto = req.body;

  try {
    if (await Role.findById(role)) {
      throw new BadReqErr("invalid role");
    }

    const user = new User({
      attrs: Object.entries(prof).map(([k, v]) => ({
        k,
        v,
      })),
      password,
      role,
      active,
    });
    await user.save();

    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
};
