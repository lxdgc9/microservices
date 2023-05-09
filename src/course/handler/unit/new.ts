import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Unit } from "../../model/unit";

type Dto = {
  code: string;
  name: string;
  addr: string;
  desc: string;
};

export const newUnit: RequestHandler = async (
  req,
  res,
  next
) => {
  const { code, name, addr, desc }: Dto = req.body;

  try {
    const unit = await Unit.findOne({ code });
    if (unit) {
      throw new ConflictErr("duplicate unit");
    }

    const newUnit = new Unit({
      code,
      name,
      addr,
      desc,
    });
    await newUnit.save();

    res.json({ unit: newUnit });
  } catch (e) {
    next(e);
  }
};
