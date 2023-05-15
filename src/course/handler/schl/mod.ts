import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Schl } from "../../model/schl";

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
    const unit = await Schl.findById(req.params.id);
    if (!unit) {
      throw new BadReqErr("unit doesn't exist");
    }

    if (
      code !== unit.code &&
      (await Schl.findOne({ code }))
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

    res.json({ unit: await Schl.findById(unit._id) });
  } catch (e) {
    next(e);
  }
};
