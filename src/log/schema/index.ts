import { Schema, Types } from "mongoose";

interface ILog {
  act: "GET" | "NEW" | "MOD" | "DEL";
  model: string;
  status: boolean;
  docId: Types.ObjectId;
  userId: Types.ObjectId;
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
    docId: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
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
