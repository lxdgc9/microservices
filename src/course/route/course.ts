import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { COURSE_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { delCourse } from "../handler/course/del";
import { getCourse } from "../handler/course/get";
import { getCourses } from "../handler/course/get-s";
import { newCourse } from "../handler/course/new";

export const r = Router();

r.route("/")
  .get(guard(COURSE_CODE.GET_COURSE), getCourses)
  .post(guard(COURSE_CODE.NEW_COURSE), validate(), newCourse);
r.route("/:id")
  .get(guard(COURSE_CODE.GET_COURSE), getCourse)
  .patch(guard(COURSE_CODE.MOD_COURSE))
  .delete(guard(COURSE_CODE.DEL_COURSE), delCourse);
