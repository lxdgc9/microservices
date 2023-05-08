import { connect } from "mongoose";
import { app } from "./app";
import { LogListener } from "./event/listener/log";
import { nats } from "./nats";

(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
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

    new LogListener(nats.cli).listen();

    connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!");
  });
})();
