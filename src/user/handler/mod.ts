import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { Role } from "../model/role";
import { User } from "../model/user";
import { nats } from "../nats";

type Dto = {
  prof?: object;
  roleId?: Types.ObjectId;
  active?: boolean;
};

export const modUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const { prof, roleId, active }: Dto = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("user doesn't exist");
    }

    if (prof) {
      const {
        username,
        phone,
        email,
      }: {
        username?: string;
        phone?: string;
        email?: string;
      } = prof;
      if (
        username &&
        (await User.findOne({
          _id: { $ne: user._id },
          attrs: {
            $elemMatch: { k: "username", v: username },
          },
        }))
      ) {
        throw new ConflictErr("duplicate username");
      }
      if (
        phone &&
        (await User.findOne({
          _id: { $ne: user._id },
          attrs: {
            $elemMatch: { k: "phone", v: phone },
          },
        }))
      ) {
        throw new ConflictErr("duplicate phone");
      }
      if (
        email &&
        (await User.findOne({
          _id: { $ne: user._id },
          attrs: {
            $elemMatch: { k: "email", v: email },
          },
        }))
      ) {
        throw new ConflictErr("duplicate email");
      }
    }

    if (roleId && !user.role.equals(roleId)) {
      const role = await Role.findById(roleId);
      if (!role) {
        throw new BadReqErr("role doesn't exist");
      }
    }

    const detail = await User.findByIdAndUpdate(user._id, {
      $set: {
        prof,
        role: roleId,
        active,
      },
    }).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.json({ user: detail });

    new LogPublisher(nats.cli).publish({
      act: "MOD",
      model: User.modelName,
      doc: user,
      actorId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
