import { Schema, Types } from "mongoose";

export interface IActor {
  act: Types.ObjectId;
  obj: any;
}
export const schema = new Schema<IActor>(
  {
    act: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    obj: {
      type: Schema.Types.Mixed,
      required: true,
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
