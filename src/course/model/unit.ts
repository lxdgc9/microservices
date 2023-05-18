import { Schema, Types, model } from "mongoose";

interface IUnit {
  code: string;
  name: string;
  addr?: string;
  desc?: string;
  logo?: string;
  classes: Types.ObjectId[];
}

const schema = new Schema<IUnit>(
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
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "class",
      },
    ],
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

export const Unit = model<IUnit>("unit", schema);
