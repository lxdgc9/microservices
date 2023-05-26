import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { User } from "../../../model/user";

export const allocUsers: RequestHandler = async (req, res, next) => {
  const {
    userIds,
    classIds,
  }: {
    userIds: Types.ObjectId[];
    classIds: Types.ObjectId[];
  } = req.body;
  try {
    const [numUserIds, numClassIds] = await Promise.all([
      User.countDocuments({
        _id: { $in: userIds },
      }),
      Class.countDocuments({
        _id: { $in: classIds },
      }),
    ]);
    if (numUserIds < userIds.length) {
      throw new BadReqErr("userIds mismatch");
    }
    if (numClassIds < classIds.length) {
      throw new BadReqErr("classIds mismatch");
    }

    await Promise.all([
      User.updateMany(
        {
          _id: {
            $in: userIds,
          },
        },
        {
          $addToSet: {
            classes: classIds,
          },
        }
      ),
    ]);

    res.json({
      numUsers: numUserIds,
      numClasses: numClassIds,
    });
  } catch (e) {
    next(e);
  }
};
