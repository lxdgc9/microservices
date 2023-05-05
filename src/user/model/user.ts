import { genSalt, hash } from "bcryptjs";
import { Schema, Types, model } from "mongoose";

interface IUser {
  attrs: {
    k: string;
    v: string;
  }[];
  password: string;
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
    password: {
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
    collection: "User",
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
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

schema.index({ "attrs.k": 1, "attrs.v": 1 });

schema.pre("save", async function (next) {
  let user = this;

  try {
    if (!user.isModified("password")) {
      next();
      return;
    }
    const salt = await genSalt(10);
    const hashed = await hash(user.password, salt);
    user.password = hashed;
    next();
  } catch (e) {
    console.log(e);
  }
});

export const User = model<IUser>("user", schema);
