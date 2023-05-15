import { Router } from "express";
import { getSchls } from "../handler/schl/get";
import { newUnit } from "../handler/schl/new";

export const r = Router();

r.get("/", getSchls);

r.post("/", newUnit);
