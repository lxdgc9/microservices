import { Schema, Types, model } from "mongoose";

interface IGroup {
  name: string;
  permissions: Types.ObjectId[];
}

const schema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "permission",
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

export const Group = model<IGroup>("group", schema);
