import _nats, { Stan } from "node-nats-streaming";

class Nats {
  private _cli?: Stan;

  get cli() {
    if (!this._cli) {
      throw new Error("Cannot access NATS");
    }
    return this._cli;
  }

  async connect(
    cluster: string,
    client: string,
    url: string
  ) {
    try {
      this._cli = _nats.connect(cluster, client, { url });
      console.log("Connected to NATS");
    } catch (e) {
      throw e;
    }
  }
}

export const nats = new Nats();
