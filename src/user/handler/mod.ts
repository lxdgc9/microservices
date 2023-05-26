import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { ModUserPublisher } from "../event/publisher/user/mod";
import { Role } from "../model/role";
import { User } from "../model/user";
import { nats } from "../nats";

export const modUser: RequestHandler = async (req, res, next) => {
  const {
    prof,
    roleId,
    active,
  }: {
    prof?: object & {
      username: string;
      phone: string;
      email: string;
    };
    roleId?: Types.ObjectId;
    active?: boolean;
  } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("user doesn't exist");
    }

    const [isDupl, existRole] = await Promise.all([
      User.exists({
        $or: [
          {
            _id: { $ne: user._id },
            attrs: {
              $elemMatch: {
                k: "username",
                v: prof?.username,
              },
            },
          },
          {
            _id: { $ne: user._id },
            attrs: {
              $elemMatch: {
                k: "phone",
                v: prof?.phone,
              },
            },
          },
          {
            _id: { $ne: user._id },
            attrs: {
              $elemMatch: {
                k: "email",
                v: prof?.email,
              },
            },
          },
        ],
      }),
      Role.exists({ _id: roleId }),
    ]);
    if (prof && isDupl) {
      throw new ConflictErr("duplicate username, phone or email");
    }
    if (roleId && !existRole) {
      throw new BadReqErr("role doesn't exist");
    }

    const updUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          attrs: Object.entries(prof || {}).map(([k, v]) => ({
            k,
            v,
          })),
          role: roleId,
          active,
        },
      },
      { new: true }
    ).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.json({ user: updUser });

    await Promise.all([
      new ModUserPublisher(nats.cli).publish(updUser!),
      new LogPublisher(nats.cli).publish({
        act: "MOD",
        model: User.modelName,
        doc: user,
        userId: req.user?.id,
        status: true,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
