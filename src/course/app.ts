import { errHandler } from "@lxdgc9/pkg/dist/middie";
import express from "express";
import { r as unitRouter } from "./route/unit";
import { r as uploadRouter } from "./route/upload";

const app = express();

app.use(express.json());

app.use("/api/courses/units", unitRouter);
app.use("/api/courses/uploads", uploadRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
