import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { MNG_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { body, param } from "express-validator";
import { delUser } from "../handler/del";
import { getUsers } from "../handler/get";
import { getUser } from "../handler/get-id";
import { login } from "../handler/login";
import { modUser } from "../handler/mod";
import { modPasswd } from "../handler/mod-pass";
import { newUser } from "../handler/new";
import { rtk } from "../handler/rtk";

export const r = Router();

r.route("/")
  .get(guard(MNG_CODE.GET_USER), getUsers)
  .post(
    validate(
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
        .optional({ values: "falsy" })
    ),
    guard(MNG_CODE.NEW_USER),
    newUser
  );
r.route("/:id")
  .get(
    validate(param("id").isMongoId()),
    guard(MNG_CODE.GET_USER),
    getUser
  )
  .patch(
    validate(
      param("id").isMongoId(),
      body("prof").optional({ values: "falsy" }).isObject(),
      body("roleId")
        .optional({ values: "falsy" })
        .isMongoId(),
      body("active")
        .optional({ values: "falsy" })
        .isBoolean()
    ),
    guard(MNG_CODE.MOD_USER),
    modUser
  )
  .delete(
    validate(param("id").isMongoId()),
    guard(MNG_CODE.DEL_USER),
    delUser
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
  "/auth/rtk",
  validate(body("token").notEmpty()),
  rtk
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
