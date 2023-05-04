import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import { BadReqErr } from "../err";
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
  param("id").isMongoId().withMessage("invalid id param"),
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
        if (v.length > 0) {
          const isValid = v.every((id: Types.ObjectId) =>
            Types.ObjectId.isValid(id)
          );
          if (!isValid) {
            throw new BadReqErr("invalid permIds");
          }
          return true;
        }
        throw new BadReqErr("permIds is required");
      }),
  ],
  validateReq,
  newRole
);

r.patch(
  "/:id",
  param("id").isMongoId().withMessage("invalid id param"),
  validateReq,
  modRole
);

r.delete(
  "/:id",
  param("id").isMongoId().withMessage("invalid id param"),
  validateReq,
  delRole
);
