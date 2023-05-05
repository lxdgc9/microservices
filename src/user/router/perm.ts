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
import { validateReq } from "../middie";

export const r = Router();

r.get("/group", getGroup);
r.post(
  "/group",
  body("name").notEmpty(),
  validateReq,
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
  validateReq,
  modGroup
);
r.delete(
  "/group/:id",
  param("id").isMongoId(),
  validateReq,
  delGroup
);

r.get("/", getPerms);
r.get(
  "/:id",
  param("id").isMongoId(),
  validateReq,
  getPermById
);
r.post(
  "/",
  [
    body("sign").notEmpty(),
    body("desc").notEmpty(),
    body("groupId").notEmpty().isMongoId(),
  ],
  validateReq,
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
  validateReq,
  modPerm
);
r.delete(
  "/:id",
  param("id").isMongoId(),
  validateReq,
  delPerm
);
