import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

type Dto = {
  code?: string;
  name?: string;
  addr?: string;
  desc?: string;
};

export const modUnit: RequestHandler = async (
  req,
  res,
  next
) => {
  const { code, name, addr, desc }: Dto = req.body;
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new BadReqErr("unit doesn't exist");
    }

    if (
      code !== unit.code &&
      (await Unit.findOne({ code }))
    ) {
      throw new ConflictErr("duplicate code");
    }

    await unit.updateOne({
      $set: {
        code,
        name,
        addr,
        desc,
      },
    });

    res.json({ unit: await Unit.findById(unit._id) });
  } catch (e) {
    next(e);
  }
};
