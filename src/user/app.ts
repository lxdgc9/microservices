import { errHandler } from "@lxdgc9/pkg/dist/middie";
import express from "express";
import { r as perm } from "./route/perm";
import { r as role } from "./route/role";
import { r as user } from "./route/user";

const app = express();

app.use(express.json());

app.use("/api/users/roles/perms", perm);
app.use("/api/users/roles", role);
app.use("/api/users", user);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
