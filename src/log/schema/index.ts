import { Schema } from "mongoose";

interface ILog {
  act: "GET" | "NEW" | "MOD" | "DEL";
  model: string;
  status: boolean;
  doc: any;
  user: any;
}

export const schema = new Schema<ILog>(
  {
    act: {
      type: String,
      enum: ["GET", "NEW", "MOD", "DEL"],
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    doc: {
      type: Schema.Types.Mixed,
    },
    user: {
      type: Schema.Types.Mixed,
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
