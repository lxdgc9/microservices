import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { COURSE_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { body, param } from "express-validator";
import { delClass } from "../handler/unit/class/del";
import { modClass } from "../handler/unit/class/mod";
import { newClass } from "../handler/unit/class/new";
import { delUnit } from "../handler/unit/del";
import { getUnits } from "../handler/unit/get";
import { getUnit } from "../handler/unit/get-id";
import { modUnit } from "../handler/unit/mod";
import { newUnit } from "../handler/unit/new";
import { uploader } from "../helper/upload";

export const r = Router();

r.route("/classes")
  .post(guard(COURSE_CODE.NEW_CLASS), newClass)
  .patch(guard(COURSE_CODE.MOD_CLASS), modClass)
  .delete(guard(COURSE_CODE.DEL_CLASS), delClass);
r.route("/classes/:id");

r.route("/")
  .get(guard(COURSE_CODE.GET_UNIT), getUnits)
  .post(
    guard(COURSE_CODE.NEW_UNIT),
    uploader("unit/logo").single("logo"),
    validate(
      body("code").notEmpty(),
      body("name").notEmpty(),
      body("addr").notEmpty(),
      body("desc")
        .optional({ values: "falsy" })
        .isLength({ min: 1, max: 255 })
    ),
    newUnit
  );
r.route("/:id")
  .get(
    validate(param("id").isMongoId()),
    guard(COURSE_CODE.GET_UNIT),
    getUnit
  )
  .patch(
    guard(COURSE_CODE.MOD_UNIT),
    uploader("unit/logo").single("logo"),
    validate(param("id").isMongoId()),
    modUnit
  )
  .delete(
    validate(param("id").isMongoId()),
    guard(COURSE_CODE.DEL_UNIT),
    delUnit
  );
