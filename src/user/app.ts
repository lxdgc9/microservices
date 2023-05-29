import { errHandler } from "@lxdgc9/pkg/dist/middie";
import express from "express";
import { r as permissionRouter } from "./route/perm";
import { r as roleRouter } from "./route/role";
import { r as userRouter } from "./route/user";

const app = express();

app.use(express.json());

app.use("/api/users/roles/permissions", permissionRouter);
app.use("/api/users/roles", roleRouter);
app.use("/api/users", userRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "Yêu cầu không tồn tại" });
});

app.use(errHandler);

export { app };
