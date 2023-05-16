import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { rmSync } from "fs";
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
      logo: req.file
        ? `/api/courses/${req.file?.path}`
        : null,
    });
    await newUnit.save();

    res.status(201).json({ unit: newUnit });
  } catch (e) {
    if (req.file) {
      rmSync(req.file.path, { force: true });
    }

    next(e);
  }
};
