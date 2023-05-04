import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../../../err";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";

type Dto = {
  sign?: string;
  desc?: string;
  permGr?: Types.ObjectId;
};

export const modPerm: RequestHandler = async (
  req,
  res,
  next
) => {
  const { sign, desc, permGr }: Dto = req.body;

  try {
    const permMod = await Perm.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          sign,
          desc,
          group: permGr,
        },
      }
    );
    if (!permMod) {
      throw new BadReqErr("perm doesn't exist");
    }

    res.json({
      perm: await Perm.findById(permMod._id).populate(
        "permGr"
      ),
    });

    if (permGr && !permMod.permGr.equals(permGr)) {
      await Promise.all([
        PermGr.findByIdAndUpdate(permMod.permGr, {
          $pull: { perms: permMod._id },
        }),
        PermGr.findByIdAndUpdate(permGr, {
          $addToSet: { perms: permMod._id },
        }),
      ]);
    }
  } catch (e) {
    next(e);
  }
};
