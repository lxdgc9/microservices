import { RequestHandler } from "express";
import { Course } from "../../model/course";

export const getCourses: RequestHandler = async (req, res, next) => {
  try {
    const courses = await Course.find(
      req.query.cursor
        ? {
            _id: { $lt: req.query.cursor },
          }
        : {}
    )
      .sort({ _id: -1 })
      .limit(parseInt((req.query.limit || 0).toString()));
    res.json({ courses });
  } catch (e) {
    next(e);
  }
};
