import { Schema, Types } from "mongoose";

interface ILog {
  act: "GET" | "NEW" | "MOD" | "DEL";
  doc: any;
  actor: Types.ObjectId;
  status: boolean;
}

export const schema = new Schema<ILog>(
  {
    act: {
      type: String,
      enum: ["GET", "NEW", "MOD", "DEL"],
      required: true,
    },
    doc: {
      type: Schema.Types.Mixed,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "actor",
    },
    status: {
      type: Boolean,
      default: false,
    },
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

schema.index({ createdAt: -1 });
