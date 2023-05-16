import { guard } from "@lxdgc9/pkg/dist/middie";
import { COURSE_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { delClass } from "../handler/class/del";
import { getClasses } from "../handler/class/get";
import { getClass } from "../handler/class/get-id";
import { modClass } from "../handler/class/mod";
import { newClass } from "../handler/class/new";

export const r = Router();

r.route("/")
  .get(guard(COURSE_CODE.GET_CLASS), getClasses)
  .post(guard(COURSE_CODE.NEW_CLASS), newClass);

r.route("/:id")
  .get(guard(COURSE_CODE.GET_CLASS), getClass)
  .patch(guard(COURSE_CODE.MOD_CLASS), modClass)
  .delete(guard(COURSE_CODE.DEL_CLASS), delClass);
