import { errHandler } from "@lxdgc9/pkg/dist/middie";
import express from "express";
import { r as schlRouter } from "./route/school";

const app = express();

app.use(express.json());

app.use("/api/courses/schls", schlRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
