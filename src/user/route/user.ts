import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { MNG_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { body, param } from "express-validator";
import { delUser } from "../handler/del";
import { delUsers } from "../handler/del-n";
import { getUser } from "../handler/get";
import { getUsers } from "../handler/get-n";
import { login } from "../handler/login";
import { modUser } from "../handler/mod";
import { modPasswd } from "../handler/mod-pass";
import { newUser } from "../handler/new";
import { newUsers } from "../handler/new-n";
import { rtk } from "../handler/rtk";

export const r = Router();

const { GET_USER, NEW_USER, MOD_USER, DEL_USER } = MNG_CODE;

r.route("/")
  .get(guard(GET_USER), getUsers)
  .post(
    guard(NEW_USER),
    validate(
      body("prof").notEmpty().isObject(),
      body("passwd").notEmpty().isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }),
      body("roleId").notEmpty().isMongoId(),
      body("active").isBoolean().optional({ values: "undefined" })
    ),
    newUser
  );

r.route("/many")
  .post(
    guard(NEW_USER),
    validate(
      body("users").notEmpty().isArray().isLength({ min: 1 }),
      body("users.*.prof").notEmpty().isObject(),
      body("users.*.passwd").notEmpty().isStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }),
      body("users.*.roleId").notEmpty().isMongoId(),
      body("users.*.active").isBoolean().optional({ values: "undefined" })
    ),
    newUsers
  )
  .delete(
    guard(DEL_USER),
    validate(
      body("userIds").notEmpty().isArray({ min: 1 }),
      body("userIds.*").isMongoId()
    ),
    delUsers
  );
r.route("/:id")
  .get(guard(GET_USER), validate(param("id").isMongoId()), getUser)
  .patch(
    guard(MOD_USER),
    validate(
      param("id").isMongoId(),
      body("prof").optional({ values: "falsy" }).isObject(),
      body("roleId").optional({ values: "falsy" }).isMongoId(),
      body("active").optional({ values: "falsy" }).isBoolean()
    ),
    modUser
  )
  .delete(guard(DEL_USER), validate(param("id").isMongoId()), delUser);

r.post(
  "/auth",
  validate(
    body("k").notEmpty(),
    body("v").notEmpty(),
    body("passwd").notEmpty()
  ),
  login
);

r.post("/auth/rtk", validate(body("token").notEmpty()), rtk);

r.patch(
  "/:id/passwd",
  guard(MOD_USER),
  validate(
    body("oldPasswd").notEmpty(),
    body("newPasswd").notEmpty().isStrongPassword({
      minLength: 6,
      minSymbols: 0,
      minLowercase: 0,
      minUppercase: 0,
    })
  ),
  modPasswd
);
