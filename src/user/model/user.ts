import { genSalt, hash } from "bcryptjs";
import { Schema, Types, model } from "mongoose";

interface IUser {
  attrs: {
    k: string;
    v: string;
  }[];
  password: string;
  role: Types.ObjectId;
  isActive: boolean;
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        ret.profile = {};
        ret.attrs.forEach(
          ({ k, v }: { k: string; v: string }) => (ret.prof[k] = v)
        );

        delete ret._id;
        delete ret.attrs;
        delete ret.passwd;
        delete ret.__v;
      },
    },
  }
);

schema.index({
  "attrs.k": 1,
  "attrs.v": 1,
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (e) {
    console.log(e);
  }
});

schema.pre("insertMany", async function (next, users) {
  try {
    const salt = await genSalt(10);
    for (const u of users) {
      u.password = await hash(u.password, salt);
    }
    next();
  } catch (e) {
    console.log(e);
  }
});

export const User = model<IUser>("user", schema);
