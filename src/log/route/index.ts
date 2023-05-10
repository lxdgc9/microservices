import { decodeJwt, guard } from "@lxdgc9/pkg/dist/middie";
import { LOG_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { getLogs } from "../handler/get";

export const r = Router();

r.get(
  "/:model",
  decodeJwt,
  guard(LOG_CODE.GET_LOG),
  getLogs
);
