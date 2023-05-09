import { Schema, model } from "mongoose";

interface IUnit {
  code: string;
  name: string;
  addr?: string;
  desc?: string;
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

schema.index({ createdAt: -1 });

export const Unit = model<IUnit>("unit", schema);
