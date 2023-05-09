import { genSalt, hash } from "bcryptjs";
import { Schema, Types, model } from "mongoose";

interface IUser {
  attrs: {
    k: string;
    v: string;
  }[];
  passwd: string;
  role: Types.ObjectId;
  active: boolean;
}

const schema = new Schema<IUser>(
  {
    attrs: [
      {
        k: {
          type: String,
        },
        v: {
          type: String,
        },
      },
    ],
    passwd: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "role",
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
        delete ret.passwd;
        delete ret.__v;
      },
    },
  }
);

schema.index({ "attrs.k": 1, "attrs.v": 1 });

schema.pre("save", async function (next) {
  if (!this.isModified("passwd")) {
    return next();
  }
  try {
    const salt = await genSalt(10);
    this.passwd = await hash(this.passwd, salt);
    next();
  } catch (e) {
    console.log(e);
  }
});

export const User = model<IUser>("user", schema);
