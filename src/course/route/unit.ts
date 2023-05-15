import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { COURSE_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { body, param } from "express-validator";
import { delUnit } from "../handler/unit/del";
import { getUnits } from "../handler/unit/get";
import { getUnitById } from "../handler/unit/get-id";
import { modUnit } from "../handler/unit/mod";
import { newUnit } from "../handler/unit/new";

export const r = Router();

r.get("/", guard(COURSE_CODE.GET_UNIT), getUnits);

r.post(
  "/",
  validate(
    body("code").notEmpty(),
    body("name").notEmpty(),
    body("addr").notEmpty(),
    body("desc").notEmpty()
  ),
  guard(COURSE_CODE.NEW_UNIT),
  newUnit
);

r.get(
  "/:id",
  validate(param("id").isMongoId()),
  guard(COURSE_CODE.GET_UNIT),
  getUnitById
);

r.patch(
  "/:id",
  validate(param("id").isMongoId()),
  guard(COURSE_CODE.MOD_UNIT),
  modUnit
);

r.delete(
  "/:id",
  validate(param("id").isMongoId()),
  guard(COURSE_CODE.DEL_UNIT),
  delUnit
);
