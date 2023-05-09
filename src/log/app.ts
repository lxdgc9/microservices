import { errHandler } from "@lxdgc9/pkg/dist/middie/err-handler";
import express from "express";
import { r as logRouter } from "./route";

const app = express();

app.use(express.json());

app.use("/api/logs", logRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
