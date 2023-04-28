import express from "express";
import fastify from "fastify";
import roleRoute from "./route/index.js";

const app = express();

const f = fastify();

f.setErrorHandler((err, _req, rep) => {
  console.log(err);
  rep.code(500).send({ msg: "something went wrong" });
});

// f.register(roleRoute, { prefix: "/api/roles" });
//
// f.get("/api/roles", (_req, rep) => {
//   rep.send({ msg: "hello world" });
// });
//
app.get("/api/roles", (_req, res) => {
  res.send({ msg: "hello world" });
});

try {
  // await f.ready();
  // await f.listen({ port: 3000 });
  app.listen(3000);
  console.log("Fastify running...");
} catch (err) {
  console.log(err);
  process.exit(1);
}
