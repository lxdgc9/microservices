import { Router } from "express";
import { param } from "express-validator";
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

r.post("/auth", login);

r.post("/", validateReq, newUser);
