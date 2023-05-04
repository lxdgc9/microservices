import { Router } from "express";
import { newUser } from "../handler/new";
import { validateReq } from "../middie";

export const r = Router();

r.get("/:id", (req, res) => {
  res.send({ msg: req.params.id });
});

r.post("/", validateReq, newUser);
