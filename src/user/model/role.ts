import { Schema, Types, model } from "mongoose";

interface IRole {
  name: string;
  level: number;
  perms: Types.ObjectId[];
}

const schema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
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

export const Role = model<IRole>("role", schema);
