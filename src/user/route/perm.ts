import {
  decodeJwt,
  guard,
  validate,
} from "@lxdgc9/pkg/dist/middie";
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

r.get(
  "/group",
  decodeJwt,
  guard(MNG_CODE.GET_PERM),
  getGroup
);
r.post(
  "/group",
  body("name").notEmpty(),
  validate,
  decodeJwt,
  guard(MNG_CODE.NEW_PERM),
  newGroup
);
r.patch(
  "/group/:id",
  [
    param("id").isMongoId(),
    body("name")
      .optional({ values: "null" })
      .isLength({ min: 1, max: 255 }),
    body("groupIds")
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
  validate,
  decodeJwt,
  guard(MNG_CODE.MOD_PERM),
  modGroup
);
r.delete(
  "/group/:id",
  param("id").isMongoId(),
  validate,
  decodeJwt,
  guard(MNG_CODE.DEL_PERM),
  delGroup
);

r.get("/", decodeJwt, guard(MNG_CODE.GET_PERM), getPerms);
r.get(
  "/:id",
  param("id").isMongoId(),
  validate,
  decodeJwt,
  guard(MNG_CODE.GET_PERM),
  getPermById
);
r.post(
  "/",
  [
    body("code").notEmpty(),
    body("desc").notEmpty(),
    body("groupId").notEmpty().isMongoId(),
  ],
  validate,
  decodeJwt,
  guard(MNG_CODE.NEW_PERM),
  newPerm
);
r.patch(
  "/:id",
  [
    param("id").isMongoId(),
    body("desc")
      .isLength({ min: 1, max: 255 })
      .optional({ values: "falsy" }),
    body("groupId")
      .isMongoId()
      .optional({ values: "falsy" }),
  ],
  validate,
  decodeJwt,
  guard(MNG_CODE.MOD_PERM),
  modPerm
);
r.delete(
  "/:id",
  param("id").isMongoId(),
  validate,
  decodeJwt,
  guard(MNG_CODE.DEL_PERM),
  delPerm
);
