import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { NewUserPublisher } from "../event/publisher/user/new";
import { Role } from "../model/role";
import { User } from "../model/user";
import { nats } from "../nats";

export const newUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    prof,
    passwd,
    roleId,
    active,
  }: {
    prof: object & {
      username: string;
      phone: string;
      email: string;
    };
    passwd: string;
    roleId: Types.ObjectId;
    active?: boolean;
  } = req.body;
  try {
    const [isDupl, exRole] = await Promise.all([
      User.exists({
        $or: [
          {
            attrs: {
              $elemMatch: {
                k: "username",
                v: prof.username,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "phone",
                v: prof.phone,
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "email",
                v: prof.email,
              },
            },
          },
        ],
      }),
      Role.exists({ _id: roleId }),
    ]);
    if (isDupl) {
      throw new ConflictErr(
        "duplicate username, phone or email"
      );
    }
    if (!exRole) {
      throw new BadReqErr("role doesn't exist");
    }

    const newUser = new User({
      attrs: Object.entries(prof).map(([k, v]) => ({
        k,
        v,
      })),
      passwd,
      role: roleId,
      active,
    });
    await newUser.save();

    const user = await User.findById(newUser._id).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.status(201).json({ user });

    await Promise.all([
      new NewUserPublisher(nats.cli).publish(user!),
      new LogPublisher(nats.cli).publish({
        act: "NEW",
        model: User.modelName,
        doc: user!,
        userId: req.user?.id,
        status: true,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
