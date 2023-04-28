import express from "express";
import { errHandler } from "@lxdgc9/micro-pkg/dist/middie";

const app = express();

app.use(express.json());

app.use("/api/users/f", (_req, res) =>
  res.send({ msg: "vl" })
);

app.use(errHandler);

export { app };
