import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../model/class";
import { User } from "../../model/user";

type Dto = {
  name?: string;
  memberIds?: Types.ObjectId[];
};

export const modClass: RequestHandler = async (
  req,
  res,
  next
) => {
  const { name, memberIds }: Dto = req.body;

  try {
    const _class = await Class.findById(req.params.id);
    if (!_class) {
      throw new BadReqErr("class doesn't exist");
    }

    if (memberIds) {
      const users = await User.find({
        _id: { $in: memberIds },
      });
      if (users.length < memberIds.length) {
        throw new BadReqErr("memberIds doesn't match");
      }

      await _class.updateOne({
        $set: {
          name,
          members: memberIds,
        },
      });
    } else {
      await _class.updateOne({
        $set: { name },
      });
    }

    const detail = await Class.findById(
      _class._id
    ).populate({
      path: "members",
      populate: {
        path: "role",
        select: "name",
      },
    });

    res.json({ class: detail });
  } catch (e) {
    next(e);
  }
};
