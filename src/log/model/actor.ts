import { model } from "mongoose";
import { IActor, schema as actorSchema } from "../schema/actor";

export const Actor = model<IActor>("actor", actorSchema);
