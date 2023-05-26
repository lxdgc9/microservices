import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Course } from "../../model/course";

export const modCourse: RequestHandler = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new BadReqErr("course not found");
    }
    res.json({});
  } catch (e) {
    next(e);
  }
};
