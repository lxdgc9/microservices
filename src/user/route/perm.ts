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
  .post(guard(MNG_CODE.NEW_PERM), validate(body("name").notEmpty()), newGroup);
r.route("/group/:id")
  .patch(
    guard(MNG_CODE.MOD_PERM),
    validate(
      param("id").isMongoId(),
      body("name").optional({ values: "null" }).isLength({ min: 1, max: 255 }),
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
    modGroup
  )
  .delete(
    guard(MNG_CODE.DEL_PERM),
    validate(param("id").isMongoId()),
    delGroup
  );
r.route("/")
  .get(guard(MNG_CODE.GET_PERM), getPerms)
  .post(
    guard(MNG_CODE.NEW_PERM),
    validate(
      body("code").notEmpty(),
      body("desc").notEmpty(),
      body("groupId").notEmpty().isMongoId()
    ),
    newPerm
  )
  .put(guard(MNG_CODE.NEW_PERM, MNG_CODE.MOD_PERM), validate());
r.route("/:id")
  .get(guard(MNG_CODE.GET_PERM), validate(param("id").isMongoId()), getPermById)
  .patch(
    guard(MNG_CODE.MOD_PERM),
    validate(
      param("id").isMongoId(),
      body("desc").isLength({ min: 1, max: 255 }).optional({ values: "falsy" }),
      body("groupId").isMongoId().optional({ values: "falsy" })
    ),
    modPerm
  )
  .delete(guard(MNG_CODE.DEL_PERM), validate(param("id").isMongoId()), delPerm);
