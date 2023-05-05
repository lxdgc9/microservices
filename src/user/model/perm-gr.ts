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
    perms: [
      {
        type: Schema.Types.ObjectId,
        ref: "perm",
      },
    ],
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

export const PermGr = model<IPermGr>("perm-gr", schema);
