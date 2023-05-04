import { RequestHandler } from "express";
import { Types } from "mongoose";

type Dto = {
  sign: object;
  prof: object;
  roleId: Types.ObjectId;
  active?: boolean;
};

export const newUser: RequestHandler = (req, res, next) => {
  const { sign, prof, roleId, active }: Dto = req.body;
  try {
    console.log({
      sign,
      prof,
      roleId,
      active,
    });
    res.send({ msg: "hello world" });
  } catch (e) {
    next(e);
  }
};
