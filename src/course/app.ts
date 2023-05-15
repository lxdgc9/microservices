import { errHandler } from "@lxdgc9/pkg/dist/middie";
import express from "express";
import { r as unitRouter } from "./route/unit";

const app = express();

app.use(express.json());

app.use("/api/courses/units", unitRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
