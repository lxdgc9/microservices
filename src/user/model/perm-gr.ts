import { Schema, Types, model } from "mongoose";

interface IPermGr {
  name: string;
  perms: Types.ObjectId[];
}

const schema = new Schema<IPermGr>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.index({ sign: 1 });

export const Perm = model<IPermGr>(
  "perm",
  schema,
  "Permission"
);
