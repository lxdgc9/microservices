import { Schema, Types, model } from "mongoose";

interface ICourse {
  user: Types.ObjectId;
  content: string;
  desc?: string;
}

const schema = new Schema<ICourse>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
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

export const Course = model<ICourse>("course", schema);
