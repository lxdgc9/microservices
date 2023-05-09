import { Router } from "express";
import { getUnits } from "../handler/unit/get";
import { newUnit } from "../handler/unit/new";

export const r = Router();

r.get("/", getUnits);

r.post("/", newUnit);
