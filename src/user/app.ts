import express from "express";
import { errHandler } from "./middie";
import { r as permRouter } from "./router/perm";
import { r as roleRouter } from "./router/role";
import { r as userRouter } from "./router/user";

const app = express();

app.use(express.json());

app.use("/api/users/roles/perms", permRouter);
app.use("/api/users/roles", roleRouter);
app.use("/api/users", userRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errHandler);

export { app };
