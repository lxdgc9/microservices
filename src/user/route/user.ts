import {
  decodeJwt,
  validate,
} from "@lxdgc9/pkg/dist/middie";
import { Router } from "express";
import { body, param } from "express-validator";
import { delUser } from "../handler/del";
import { getUsers } from "../handler/get";
import { getUserById } from "../handler/get-id";
import { login } from "../handler/login";
import { modUser } from "../handler/mod";
import { modPasswd } from "../handler/mod-pass";
import { newUser } from "../handler/new";
import { refreshTkn } from "../handler/refresh-tkn";

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
    body("passwd").notEmpty(),
  ],
  validate,
  login
);

r.post(
  "/auth/refresh-token",
  body("token").notEmpty(),
  validate,
  refreshTkn
);

r.post(
  "/",
  [
    body("prof").notEmpty().isObject(),
    body("passwd").notEmpty().isStrongPassword({
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

r.patch(
  "/:id/passwd",
  [
    body("oldPasswd").notEmpty(),
    body("newPasswd").notEmpty().isStrongPassword({
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minSymbols: 0,
    }),
  ],
  validate,
  decodeJwt,
  modPasswd
);

r.patch("/:id", validate, decodeJwt, modUser);

r.delete("/:id", validate, decodeJwt, delUser);
