import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { MNG_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import { delPerm } from "../handler/role/perm/del";
import { getPerms } from "../handler/role/perm/get";
import { getPermById } from "../handler/role/perm/get-id";
import { delGroup } from "../handler/role/perm/group/del";
import { getGroup } from "../handler/role/perm/group/get";
import { modGroup } from "../handler/role/perm/group/mod";
import { newGroup } from "../handler/role/perm/group/new";
import { modPerm } from "../handler/role/perm/mod";
import { newPerm } from "../handler/role/perm/new";

export const r = Router();

r.route("/group")
  .get(guard(MNG_CODE.GET_PERM), getGroup)
  .post(
    validate(body("name").notEmpty()),
    guard(MNG_CODE.NEW_PERM),
    newGroup
  );
r.route("/group/:id")
  .patch(
    validate(
      param("id").isMongoId(),
      body("name")
        .optional({ values: "null" })
        .isLength({ min: 1, max: 255 }),
      body("permIds")
        .optional({ values: "undefined" })
        .isArray()
        .custom((ids) => {
          if (ids) {
            const isValid = ids.every((id: string) =>
              Types.ObjectId.isValid(id)
            );
            if (!isValid) {
              throw new Error("invalid ObjectId in array");
            }
          }
          return true;
        })
    ),
    guard(MNG_CODE.MOD_PERM),
    modGroup
  )
  .delete(
    validate(param("id").isMongoId()),
    guard(MNG_CODE.DEL_PERM),
    delGroup
  );
r.route("/")
  .get(guard(MNG_CODE.GET_PERM), getPerms)
  .post(
    validate(
      body("code").notEmpty(),
      body("desc").notEmpty(),
      body("groupId").notEmpty().isMongoId()
    ),
    guard(MNG_CODE.NEW_PERM),
    newPerm
  );
r.route("/:id")
  .get(
    validate(param("id").isMongoId()),
    guard(MNG_CODE.GET_PERM),
    getPermById
  )
  .patch(
    validate(
      param("id").isMongoId(),
      body("desc")
        .isLength({ min: 1, max: 255 })
        .optional({ values: "falsy" }),
      body("groupId")
        .isMongoId()
        .optional({ values: "falsy" })
    ),
    guard(MNG_CODE.MOD_PERM),
    modPerm
  )
  .delete(
    validate(param("id").isMongoId()),
    guard(MNG_CODE.DEL_PERM),
    delPerm
  );
