import { Schema, Types, model } from "mongoose";

interface IRole {
  name: string;
  level: number;
  permissions: Types.ObjectId[];
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
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "permission",
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
