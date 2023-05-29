import { Schema, Types, model } from "mongoose";

interface IGroup {
  name: string;
  permission: Types.ObjectId[];
}

const schema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    permission: [
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

export const Group = model<IGroup>("group", schema);
