import { Schema, Types, model } from "mongoose";

interface IPerm {
  code: string;
  desc: string;
  group: Types.ObjectId;
}

const schema = new Schema<IPerm>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "perm-gr",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Perm = model<IPerm>("perm", schema);
