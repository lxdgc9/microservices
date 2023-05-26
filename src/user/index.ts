import { connect } from "mongoose";
import { app } from "./app";
import { nats } from "./nats";
import { redis } from "./redis";

(async () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET must be defined");
  }
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.REDIS_URI) {
    throw new Error("REDIS_HOST must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await nats.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    nats.cli.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => nats.cli.close());
    process.on("SIGTERM", () => nats.cli.close());

    connect(process.env.MONGO_URI).then(() =>
      console.log("Connected to MongoDb")
    );

    await redis.connect();
    await redis.ping().then(() => console.log("Connected to Redis"));
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => console.log("Listening on port 3000!!!"));
})();
