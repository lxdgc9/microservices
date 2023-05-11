import { Schema, Types, model } from "mongoose";

interface IUser {
  userId: Types.ObjectId;
  prof: object;
  role: string;
  active: boolean;
}

const schema = new Schema<IUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    prof: {
      type: Schema.Types.Mixed,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        ret.prof = {};
        ret.attrs.forEach(
          ({ k, v }: { k: string; v: string }) =>
            (ret.prof[k] = v)
        );

        delete ret._id;
        delete ret.attrs;
        delete ret.__v;
      },
    },
  }
);

schema.index({ "attrs.k": 1, "attrs.v": 1 });

export const User = model<IUser>("user", schema);
