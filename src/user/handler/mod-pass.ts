import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { User } from "../model/user";

export const modPasswd: RequestHandler = async (
  req,
  res,
  next
) => {
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
      throw new BadReqErr("user doesn't exist");
    }

    const passMatch = await compare(oldPasswd, user.passwd);
    if (!passMatch) {
      throw new BadReqErr("wrong password");
    }

    await user.updateOne({
      $set: { passwd: newPasswd },
    });

    res.json({ msg: "change password successfully" });
  } catch (e) {
    next(e);
  }
};
