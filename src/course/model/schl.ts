import { Schema, model } from "mongoose";

interface ISchl {
  code: string;
  name: string;
  addr?: string;
  desc?: string;
  logo?: string;
}

const schema = new Schema<ISchl>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    addr: {
      type: String,
    },
    desc: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Schl = model<ISchl>("schl", schema);
