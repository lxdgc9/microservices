import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
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
  [
    body("name").notEmpty(),
    body("permIds")
      .isArray()
      .custom((v) => {
        if (v) {
          const isValid = v.every((id: string) =>
            Types.ObjectId.isValid(id)
          );
          if (!isValid) {
            throw new Error("invalid ObjectId in array");
          }
        }
        return true;
      }),
  ],
  validateReq,
  newRole
);

r.patch(
  "/:id",
  [
    param("id").isMongoId(),
    body("permIds")
      .optional({ values: "falsy" })
      .isArray()
      .custom((v) => {
        if (v) {
          const isValid = v.every((id: string) =>
            Types.ObjectId.isValid(id)
          );
          if (!isValid) {
            throw new Error("invalid ObjectId in array");
          }
        }
        return true;
      }),
  ],
  validateReq,
  modRole
);

r.delete(
  "/:id",
  param("id").isMongoId(),
  validateReq,
  delRole
);
