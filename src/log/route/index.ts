import { guard } from "@lxdgc9/pkg/dist/middie";
import { LOG_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { getLogs } from "../handler/get";
import { getSrv } from "../handler/get-srv";

export const r = Router();

r.get("/srvs", guard(LOG_CODE.GET_LOG), getSrv);

r.get("/:srv", guard(LOG_CODE.GET_LOG), getLogs);
