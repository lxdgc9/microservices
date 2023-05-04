import { Schema, Types, model } from "mongoose";

interface IRole {
  name: string;
  perms: Types.ObjectId[];
}

const schema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
    perms: [
      {
        type: Schema.Types.ObjectId,
        ref: "perm",
      },
    ],
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

schema.index({
  perms: 1,
  createdAt: -1,
});

export const Role = model<IRole>("role", schema, "Role");
