import { log } from "console";
import { connect } from "mongoose";
import { app } from "./app";
import { nats } from "./nats";
import { redis } from "./redis";

(async () => {
  [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "MONGO_URI",
    "REDIS_URI",
    "NATS_CLUSTER_ID",
    "NATS_CLIENT_ID",
    "NATS_URL",
  ].forEach((k) => {
    if (!process.env[k]) {
      throw new Error(`${k} must be defined`);
    }
  });

  try {
    await nats.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    nats.cli.on("close", () => {
      log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => nats.cli.close());
    process.on("SIGTERM", () => nats.cli.close());

    connect(process.env.MONGO_URI!).then(() => log("Connected to MongoDb"));

    await redis.connect();
    await redis.ping().then(() => log("Connected to Redis"));
  } catch (e) {
    log(e);
  }

  app.listen(3000, () => log("Listening on port 3000!!!"));
})();
