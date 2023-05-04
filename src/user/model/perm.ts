import { Schema, Types, model } from "mongoose";

interface IPerm {
  sign: string;
  desc: string;
  permGr: Types.ObjectId;
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
      required: true,
    },
    permGr: {
      type: Schema.Types.ObjectId,
      ref: "perm-gr",
      required: true,
    },
  },
  {
    collection: "Permission",
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.index({ sign: 1, permGr: 1 });

export const Perm = model<IPerm>("perm", schema);
