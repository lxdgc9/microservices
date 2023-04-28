import { connect } from "mongoose";
import { app } from "./app";
import { Nats } from "./nats";

// Top level async/await
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
    // const nats = new Nats();
    // await nats.connect(
    //   process.env.NATS_CLUSTER_ID,
    //   process.env.NATS_CLIENT_ID,
    //   process.env.NATS_URL
    // );
    // nats.cli.on("close", () => {
    //   console.log("NATS connection closed!");
    //   process.exit();
    // });
    // process.on("SIGINT", () => nats.cli.close());
    // process.on("SIGTERM", () => nats.cli.close());

    connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  app.listen(3000, () => console.log("Listening..."));
})();
