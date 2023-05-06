import express from "express";
import { errHandler } from "./middie/err-handler";

const app = express();

app.use(express.json());

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
