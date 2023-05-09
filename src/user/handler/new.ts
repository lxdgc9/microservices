import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../event/publisher/log";
import { NewUserPublisher } from "../event/publisher/new-user";
import { Role } from "../model/role";
import { User } from "../model/user";
import { nats } from "../nats";

type Dto = {
  prof: object;
  passwd: string;
  roleId: Types.ObjectId;
  active?: boolean;
};

export const newUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const { prof, passwd, roleId, active }: Dto = req.body;

  try {
    if (!(await Role.findById(roleId))) {
      throw new BadReqErr("role doesn't exist");
    }

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
        attrs: {
          $elemMatch: { k: "email", v: email },
        },
      }))
    ) {
      throw new ConflictErr("duplicate email");
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

    const detail = await User.findById(
      newUser._id
    ).populate({
      path: "role",
      populate: {
        path: "perms",
        select: "-group",
      },
    });

    res.status(201).json({ user: detail });

    new NewUserPublisher(nats.cli).publish({
      actor: detail!,
    });
    new LogPublisher(nats.cli).publish({
      act: "NEW",
      model: User.modelName,
      doc: detail!,
      actorId: req.user?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
