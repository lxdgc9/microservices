import {
  decodeJwt,
  validate,
} from "@lxdgc9/pkg/dist/middie";
import { Router } from "express";
import { body, param } from "express-validator";
import { getUsers } from "../handler/get";
import { getUserById } from "../handler/get-id";
import { login } from "../handler/login";
import { newUser } from "../handler/new";

export const r = Router();

r.get("/", decodeJwt, getUsers);

r.get(
  "/:id",
  param("id").isMongoId(),
  validate,
  decodeJwt,
  getUserById
);

r.post(
  "/auth",
  [
    body("k").notEmpty(),
    body("v").notEmpty(),
    body("password").notEmpty(),
  ],
  validate,
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
  validate,
  decodeJwt,
  newUser
);
