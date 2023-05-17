import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { MNG_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import { delRole } from "../handler/role/del";
import { getRoles } from "../handler/role/get";
import { getRole } from "../handler/role/get-id";
import { modRole } from "../handler/role/mod";
import { newRole } from "../handler/role/new";

export const r = Router();

r.route("/")
  .get(guard(MNG_CODE.GET_ROLE), getRoles)
  .post(
    validate(
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
        })
    ),
    guard(MNG_CODE.NEW_ROLE),
    newRole
  );
r.route("/:id")
  .get(
    validate(param("id").isMongoId()),
    guard(MNG_CODE.GET_ROLE),
    getRole
  )
  .patch(
    validate(
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
        })
    ),
    guard(MNG_CODE.MOD_ROLE),
    modRole
  )
  .delete(
    validate(param("id").isMongoId()),
    guard(MNG_CODE.DEL_ROLE),
    delRole
  );
