import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { MNG_CODE } from "@lxdgc9/pkg/dist/perm";
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

r.get("/", guard(MNG_CODE.GET_USER), getUsers);

r.get(
  "/:id",
  validate(param("id").isMongoId()),
  guard(MNG_CODE.GET_USER),
  getUserById
);

r.post(
  "/auth",
  validate(
    body("k").notEmpty(),
    body("v").notEmpty(),
    body("passwd").notEmpty()
  ),
  login
);

r.post(
  "/auth/refresh-token",
  validate(body("token").notEmpty()),
  refreshTkn
);

r.post(
  "/",
  validate(
    body("prof").notEmpty().isObject(),
    body("passwd").notEmpty().isStrongPassword({
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minSymbols: 0,
    }),
    body("roleId").notEmpty().isMongoId(),
    body("active").isBoolean().optional({ values: "falsy" })
  ),
  guard(MNG_CODE.NEW_USER),
  newUser
);

r.patch(
  "/:id/passwd",
  validate(
    body("oldPasswd").notEmpty(),
    body("newPasswd").notEmpty().isStrongPassword({
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minSymbols: 0,
    })
  ),
  guard(MNG_CODE.MOD_USER),
  modPasswd
);

r.patch(
  "/:id",
  validate(
    param("id").isMongoId(),
    body("prof").optional({ values: "falsy" }).isObject(),
    body("roleId")
      .optional({ values: "falsy" })
      .isMongoId(),
    body("active").optional({ values: "falsy" }).isBoolean()
  ),
  guard(MNG_CODE.MOD_USER),
  modUser
);

r.delete(
  "/:id",
  validate(param("id").isMongoId()),
  guard(MNG_CODE.DEL_USER),
  delUser
);
