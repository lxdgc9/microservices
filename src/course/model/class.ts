import { Schema, Types, model } from "mongoose";

interface IClass {
  unit: Types.ObjectId;
  members: Types.ObjectId[];
}

const schema = new Schema<IClass>(
  {
    unit: {
      type: Schema.Types.ObjectId,
      ref: "unit",
      required: true,
    },
    members: [
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

export const Class = model<IClass>("class", schema);
