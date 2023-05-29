import { guard, validate } from "@lxdgc9/pkg/dist/middie";
import { MNG_CODE } from "@lxdgc9/pkg/dist/perm";
import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import { delPerm } from "../handler/role/perm/del";
import { getPerms } from "../handler/role/perm/get";
import { getPermById } from "../handler/role/perm/get-id";
import { delGroup } from "../handler/role/perm/group/del";
import { getGroups } from "../handler/role/perm/group/get";
import { modGroup } from "../handler/role/perm/group/mod";
import { newGroup } from "../handler/role/perm/group/new";
import { newGroups } from "../handler/role/perm/group/new-n";
import { modPerm } from "../handler/role/perm/mod";
import { newPerm } from "../handler/role/perm/new";

export const r = Router();

const { GET_PERM, NEW_PERM, MOD_PERM, DEL_PERM } = MNG_CODE;

r.route("/group")
  .get(guard(GET_PERM), getGroups)
  .post(
    guard(NEW_PERM),
    validate(
      body("name")
        .notEmpty()
        .withMessage("bắt buộc")
        .isString()
        .withMessage("phải là chuỗi ký tự")
        .isLength({ min: 1, max: 255 })
        .withMessage("1 <= độ dài hợp lệ <= 255")
        .trim()
    ),
    newGroup
  );
r.route("/group/many").post(
  guard(NEW_PERM),
  validate(
    body("names")
      .isArray({ min: 1 })
      .withMessage("bắt buộc là mảng, ít nhất 1 phần tử"),
    body("names.*")
      .isLength({ min: 1, max: 255 })
      .withMessage("1 <= độ dài hợp lệ <= 255")
      .trim()
  ),
  newGroups
);
r.route("/group/:id")
  .patch(
    guard(MOD_PERM),
    validate(
      param("id").isMongoId(),
      body("name")
        .optional({ values: "undefined" })
        .isLength({ min: 1, max: 255 }),
      body("permIds")
        .optional({ values: "undefined" })
        .isArray()
        .custom((ids) => {
          if (ids) {
            const isValid = ids.every((id: string) =>
              Types.ObjectId.isValid(id)
            );
            if (!isValid) {
              throw new Error("invalid ObjectId in array");
            }
          }
          return true;
        })
    ),
    modGroup
  )
  .delete(
    guard(DEL_PERM),
    validate(param("id").isMongoId().withMessage("sai format mongoId")),
    delGroup
  );
r.route("/")
  .get(guard(GET_PERM), getPerms)
  .post(
    guard(NEW_PERM),
    validate(
      body("code").notEmpty().withMessage("bắt buộc"),
      body("desc")
        .notEmpty()
        .withMessage("bắt buộc")
        .isLength({ max: 255 })
        .withMessage("vượt quá 255 ký tự"),
      body("group_id")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("sai format mongoId")
    ),
    newPerm
  )
  .put(guard(MNG_CODE.NEW_PERM, MNG_CODE.MOD_PERM), validate());
r.route("/:id")
  .get(
    guard(MNG_CODE.GET_PERM),
    validate(param("id").isMongoId().withMessage("sai format mongoId")),
    getPermById
  )
  .patch(
    guard(MNG_CODE.MOD_PERM),
    validate(
      param("id").isMongoId(),
      body("desc")
        .isLength({ min: 1, max: 255 })
        .optional({ values: "undefined" }),
      body("groupId")
        .optional({ values: "undefined" })
        .isMongoId()
        .withMessage("sai format mongoId")
    ),
    modPerm
  )
  .delete(
    guard(MNG_CODE.DEL_PERM),
    validate(param("id").isMongoId().withMessage("sai format mongoId")),
    delPerm
  );
