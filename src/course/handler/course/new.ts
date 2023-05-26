import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Course } from "../../model/course";

export const newCourse: RequestHandler = async (req, res, next) => {
  const { userId }: { userId: Types.ObjectId } = req.body;
  try {
    const newCourse = new Course({
      user: userId,
    });
    await newCourse.save();

    const course = await Course.findById(newCourse._id).populate({
      path: "user",
    });

    res.status(201).json({ course });
  } catch (e) {
    next(e);
  }
};
