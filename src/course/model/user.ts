import { Schema, Types, model } from "mongoose";

interface IUser {
  userId: Types.ObjectId;
  obj: any;
  classes: Types.ObjectId[];
}

const schema = new Schema<IUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    obj: {
      type: Schema.Types.Mixed,
      required: true,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
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

export const User = model<IUser>("user", schema);
