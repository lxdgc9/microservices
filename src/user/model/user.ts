import { Schema, Types, model } from "mongoose";

interface IUser {
  attrs: {
    k: string;
    v: string;
  }[];
  role: Types.ObjectId;
  active: boolean;
}

const schema = new Schema<IUser>(
  {
    attrs: [
      {
        k: String,
        v: String,
      },
    ],
    role: {
      type: Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.index({ "attrs.k": 1, "attrs.v": 1 });

export const User = model<IUser>("user", schema, "User");
