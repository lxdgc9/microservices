import { Schema, Types, model } from "mongoose";

interface IPerm {
  sign: string;
  desc: string;
  type: Types.ObjectId;
}

const schema = new Schema<IPerm>(
  {
    sign: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: "perm-gr",
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

export const Perm = model<IPerm>(
  "perm",
  schema,
  "Permission"
);
