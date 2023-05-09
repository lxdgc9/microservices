import { Router } from "express";
import { getLogs } from "../handler/get";

export const r = Router();

r.get("/:model", getLogs);
