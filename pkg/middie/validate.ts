import { RequestHandler } from "express";
import { ValidationChain, validationResult } from "express-validator";

export function validate(...chains: ValidationChain[]) {
  const _: RequestHandler = async (req, res, next) => {
    for (const c of chains) {
      await c.run(req);
    }

    const e = validationResult(req);
    if (!e.isEmpty()) {
      return res.status(400).json({ errs: e.array() });
    }
    next();
  };
  return _;
}
