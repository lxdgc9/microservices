import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../err";
import { Role } from "../model/role";
import { User } from "../model/user";

type Dto = {
  prof: object;
  password: string;
  roleId: Types.ObjectId;
  active?: boolean;
};

export const newUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const { prof, password, roleId, active }: Dto = req.body;

  try {
    if (await Role.findById(roleId)) {
      throw new BadReqErr("role doesn't exist");
    }

    const newUser = new User({
      attrs: Object.entries(prof).map(([k, v]) => ({
        k,
        v,
      })),
      password,
      role: roleId,
      active,
    });
    await newUser.save();

    res
      .status(201)
      .json({ user: await User.findById(newUser._id) });
  } catch (e) {
    next(e);
  }
};
