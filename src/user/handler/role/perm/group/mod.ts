import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "../../../../err";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";

type Dto = {
  name?: string;
  permIds?: Types.ObjectId[];
};

export const modPermGr: RequestHandler = async (req, res, next) => {
  const { name, permIds }: Dto = req.body;
  try {
    const permGr = await PermGr.findById(req.params.id);
    if (!permGr) {
      throw new BadReqErr("permGr doesn't exist");
    }

    if (permIds?.length) {
      const perms = await Perm.find({ _id: permIds });
      if (permIds.length > perms.length) {
        throw new BadReqErr("permIds doesn't match");
      }

      const permsRemove = permGr.perms.filter((p) => !permIds.includes(p));
      await permGr.updateOne({
        $set: {
          name,
          perms: permIds,
        },
      });
      await Perm.deleteMany({ _id: permsRemove });
    } else {
      await permGr.updateOne({
        $set: {
          name,
        },
      });
    }

    const detail = await PermGr.findById(permGr._id).populate({
      path: "perms",
      select: "-group",
    });

    res.send({ permGr: detail });
  } catch (e) {
    next(e);
  }
};
