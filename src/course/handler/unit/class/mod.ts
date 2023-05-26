import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../../model/class";
import { Unit } from "../../../model/unit";
import { User } from "../../../model/user";

export const modClass: RequestHandler = async (req, res, next) => {
  const {
    name,
    unitId,
    memberIds,
  }: {
    name?: string;
    unitId?: Types.ObjectId;
    memberIds?: Types.ObjectId[];
  } = req.body;
  try {
    const [_class, exUnit, numMembers] = await Promise.all([
      Class.findById(req.params.id),
      Unit.exists({ _id: unitId }),
      User.countDocuments({
        _id: {
          $in: memberIds,
        },
      }),
    ]);
    if (!_class) {
      throw new BadReqErr("class not found");
    }
    if (unitId && !exUnit) {
      throw new BadReqErr("unit not found");
    }
    if (memberIds?.length && numMembers < memberIds.length) {
      throw new BadReqErr("memberIds mismatch");
    }

    await Promise.all([
      _class.updateOne({
        $set: {
          name,
          unit: unitId,
          members: memberIds,
        },
      }),
      unitId &&
        !_class.unit.equals(unitId) &&
        Promise.all([
          Unit.findByIdAndUpdate(unitId, {
            $addToSet: {
              classes: _class._id,
            },
          }),
          Unit.findByIdAndUpdate(_class.unit, {
            $pull: {
              classes: _class._id,
            },
          }),
        ]),
    ]);

    const updClass = await Class.findById(_class._id).populate({
      path: "unit",
      select: "-classes",
    });

    res.json({ _class: updClass });
  } catch (e) {
    next(e);
  }
};
