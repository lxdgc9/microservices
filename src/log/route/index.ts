import { guard } from "@lxdgc9/pkg/dist/middie";
import { Router } from "express";
import { getLogs } from "../handler/get";

export const r = Router();

r.get("/:model", guard(), getLogs);
