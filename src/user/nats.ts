import nats, { Stan } from "node-nats-streaming";

export class Nats {
  private _cli?: Stan;

  get cli() {
    if (!this._cli) {
      throw new Error("Cannot access NATS");
    }

    return this._cli;
  }

  connect(clusId: string, cliId: string, url: string) {
    this._cli = nats.connect(clusId, cliId, { url });

    return new Promise<void>((resolve, reject) => {
      this.cli.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.cli.on("error", (err) => {
        reject(err);
      });
    });
  }
}
