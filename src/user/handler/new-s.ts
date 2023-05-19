import {
  BadReqErr,
  ConflictErr,
} from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Role } from "../model/role";
import { User } from "../model/user";

export const newUsers: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    users,
  }: {
    users: {
      prof: object & {
        username: string;
        phone: string;
        email: string;
      };
      passwd: string;
      roleId: Types.ObjectId;
      active?: boolean;
    }[];
  } = req.body;
  try {
    const [isDupl, numRoles] = await Promise.all([
      User.exists({
        $or: [
          {
            attrs: {
              $elemMatch: {
                k: "username",
                v: users.map((u) => u.prof.username),
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "phone",
                v: users.map((u) => u.prof.phone),
              },
            },
          },
          {
            attrs: {
              $elemMatch: {
                k: "email",
                v: users.map((u) => u.prof.email),
              },
            },
          },
        ],
      }),
      Role.countDocuments({
        _id: users.map((u) => u.roleId),
      }),
    ]);
    if (
      isDupl ||
      [...new Set(users.map((u) => u.prof.username))]
        .length < users.length ||
      [...new Set(users.map((u) => u.prof.phone))].length <
        users.length ||
      [...new Set(users.map((u) => u.prof.email))].length <
        users.length
    ) {
      throw new ConflictErr(
        "duplicate username, phone or email"
      );
    }
    if (
      numRoles <
      [...new Set(users.map((u) => u.roleId))].length
    ) {
      throw new BadReqErr("roleIds doesn't match");
    }

    const _users = await User.insertMany(
      users.map(({ prof, passwd, roleId, active }) => ({
        attrs: Object.entries(prof).map(([k, v]) => ({
          k,
          v,
        })),
        passwd,
        role: roleId,
        active,
      }))
    );

    res.status(201).json({ users: _users });
  } catch (e) {
    next(e);
  }
};
