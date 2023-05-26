import { errHandler } from "@lxdgc9/pkg/dist/middie";
import compress from "compression";
import express from "express";
import { r as unit } from "./route/unit";
import { r as upload } from "./route/upload";

const app = express();

app.use(compress());
app.use(express.json());

app.use("/api/courses/units", unit);
app.use("/api/courses/uploads", upload);

app.all("*", (_req, res) => {
  res.status(404).json({ msg: "request not found" });
});

app.use(errHandler);

export { app };
