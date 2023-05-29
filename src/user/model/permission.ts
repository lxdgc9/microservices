import { Schema, Types, model } from "mongoose";

interface IPermission {
  code: string;
  description: string;
  group: Types.ObjectId;
}

const schema = new Schema<IPermission>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "group",
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

export const Permission = model<IPermission>("permission", schema);
