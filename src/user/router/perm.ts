import { Router } from "express";
import { body, param } from "express-validator";
import { getPerms } from "../handler/role/perm/get";
import { getPermById } from "../handler/role/perm/get-id";
import { delPermGr } from "../handler/role/perm/group/del";
import { getPermGr } from "../handler/role/perm/group/get";
import { modPermGr } from "../handler/role/perm/group/mod";
import { newPermGr } from "../handler/role/perm/group/new";
import { newPerm } from "../handler/role/perm/new";
import { validateReq } from "../middie";

export const r = Router();

r.get("/group", getPermGr);
r.post(
  "/group",
  body("name").notEmpty().withMessage("name required"),
  validateReq,
  newPermGr
);
r.patch(
  "/group/:id",
  [
    param("id").isMongoId().withMessage("invalid param id"),
    body("name")
      .optional({ values: "null" })
      .isLength({ min: 1, max: 255 })
      .withMessage("invalid name. 1 <= name.length <= 255"),
    body("permIds")
      .optional({ values: "falsy" })
      .isArray()
      .withMessage("permIds must be array of mongoId"),
  ],
  validateReq,
  modPermGr
);

r.delete(
  "/group/:id",
  param("id").isMongoId().withMessage("invalid param id"),
  validateReq,
  delPermGr
);

r.get("/", getPerms);
r.get("/:id", [], validateReq, getPermById);
r.post(
  "/",
  [
    body("sign").notEmpty().withMessage("sign required"),
    body("desc").notEmpty().withMessage("desc required"),
    body("groupId")
      .notEmpty()
      .withMessage("groupId required")
      .isMongoId()
      .withMessage("invalid groupId"),
  ],
  validateReq,
  newPerm
);
