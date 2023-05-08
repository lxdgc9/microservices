import _nats, { Stan } from "node-nats-streaming";

class Nats {
  private _cli?: Stan;

  get cli() {
    if (!this._cli) {
      throw new Error("Cannot access NATS");
    }
    return this._cli;
  }

  connect(cluster: string, client: string, url: string) {
    this._cli = _nats.connect(cluster, client, { url });

    return new Promise<void>((resolve, reject) => {
      this.cli.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.cli.on("error", (e) => reject(e));
    });
  }
}

export const nats = new Nats();
