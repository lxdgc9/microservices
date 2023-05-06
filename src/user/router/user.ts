import { Router } from "express";
import { body, param } from "express-validator";
import { getUsers } from "../handler/get";
import { getUserById } from "../handler/get-id";
import { login } from "../handler/login";
import { newUser } from "../handler/new";
import { validateReq } from "../middie";

export const r = Router();

r.get("/", getUsers);

r.get(
  "/:id",
  param("id").isMongoId(),
  validateReq,
  getUserById
);

r.post(
  "/auth",
  [
    body("k").notEmpty(),
    body("v").notEmpty(),
    body("password").notEmpty(),
  ],
  validateReq,
  login
);

r.post(
  "/",
  [
    body("prof").notEmpty().isObject(),
    body("password").notEmpty().isStrongPassword({
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minSymbols: 0,
    }),
    body("roleId").notEmpty().isMongoId(),
    body("active")
      .isBoolean()
      .optional({ values: "falsy" }),
  ],
  validateReq,
  newUser
);
