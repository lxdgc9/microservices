import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/http";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log(err);

  if (err instanceof HttpError) {
    return res.status(err.code).json({
      name: err.name,
      message: err.message,
    });
  }

  res.status(500).json({
    name: "system-error",
    message: "Có gì đó sai sai!!!",
  });
};
