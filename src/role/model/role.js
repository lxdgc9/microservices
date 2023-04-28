import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    perms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "perm",
      },
    ],
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

schema.index({ perms: -1, createdAt: -1 });

export const Role = mongoose.model("role", schema, "Role");
