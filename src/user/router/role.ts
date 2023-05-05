import { Router } from "express";
import { body, param } from "express-validator";
import { delRole } from "../handler/role/del";
import { getRoles } from "../handler/role/get";
import { getRoleById } from "../handler/role/get-id";
import { modRole } from "../handler/role/mod";
import { newRole } from "../handler/role/new";
import { validateReq } from "../middie";

export const r = Router();

r.get("/", getRoles);
r.get(
  "/:id",
  param("id").isMongoId(),
  validateReq,
  getRoleById
);
r.post(
  "/",
  [body("name").notEmpty(), body("permIds").isArray()],
  validateReq,
  newRole
);

r.patch(
  "/:id",
  param("id").isMongoId(),
  validateReq,
  modRole
);

r.delete(
  "/:id",
  param("id").isMongoId(),
  validateReq,
  delRole
);
