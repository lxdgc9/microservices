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
        k: {
          type: String,
        },
        v: {
          type: String,
        },
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
    collection: "User",
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

schema.index({
  "attrs.k": 1,
  "attrs.v": 1,
});

export const User = model<IUser>("user", schema);
