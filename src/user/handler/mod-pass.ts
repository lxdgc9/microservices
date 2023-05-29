import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { User } from "../model/user";

export const modPasswd: RequestHandler = async (req, res, next) => {
  const {
    oldPasswd,
    newPasswd,
  }: {
    oldPasswd: string;
    newPasswd: string;
  } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("user not found");
    }

    const match = await compare(oldPasswd, user.password);
    if (!match) {
      throw new BadReqErr("wrong password");
    }

    user.password = newPasswd;
    await user.save();

    res.json({ msg: "changed password" });
  } catch (e) {
    next(e);
  }
};
