import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Class } from "../../../model/class";
import { Unit } from "../../../model/unit";
import { User } from "../../../model/user";

export const delClass: RequestHandler = async (req, res, next) => {
  try {
    const _class = await Class.findByIdAndDelete(req.params.id);
    if (!_class) {
      throw new BadReqErr("class not found");
    }

    res.json({ msg: "deleted class" });

    await Promise.all([
      Unit.findOneAndUpdate(_class.unit, {
        $pull: {
          classes: _class._id,
        },
      }),
      User.deleteMany(
        {
          _id: {
            $in: _class.members,
          },
        },
        {
          $pull: {
            classes: _class._id,
          },
        }
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
