import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Schl } from "../../model/schl";

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
    const unit = await Schl.findOne({ code });
    if (unit) {
      throw new ConflictErr("duplicate unit");
    }

    const newUnit = new Schl({
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
