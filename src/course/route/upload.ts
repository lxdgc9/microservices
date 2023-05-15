import { guard } from "@lxdgc9/pkg/dist/middie";
import { Router } from "express";
import { getFile } from "../handler/upload/get";

export const r = Router();

r.get("/*", guard(), getFile);
