import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    sign: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "perm-gr",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.index({ sign: 1 });

export const Perm = model("perm", schema, "Permission");
