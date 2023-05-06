import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";

type Dto = {
  name?: string;
  groupIds?: Types.ObjectId[];
};

export const modGroup: RequestHandler = async (
  req,
  res,
  next
) => {
  const { name, groupIds }: Dto = req.body;
  try {
    const group = await PermGr.findById(req.params.id);
    if (!group) {
      throw new BadReqErr("permission group doesn't exist");
    }

    if (groupIds) {
      const perms = await Perm.find({
        _id: { $in: groupIds },
      });
      if (groupIds.length > perms.length) {
        throw new Error("groupIds doesn't match");
      }

      Promise.all([
        await group.updateOne({
          $set: {
            name,
            perms: groupIds,
          },
        }),
        await Perm.deleteMany({
          _id: group.perms.filter(
            (p) => !groupIds.includes(p)
          ),
        }),
      ]);
    } else {
      await group.updateOne({
        $set: { name },
      });
    }

    res.json({
      group: await PermGr.findById(group._id).populate({
        path: "perms",
        select: "-group",
      }),
    });
  } catch (e) {
    next(e);
  }
};
