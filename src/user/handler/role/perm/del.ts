import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../event/publisher/log";
import { Group } from "../../../model/group";
import { Permission } from "../../../model/permission";
import { nats } from "../../../nats";

export const delPerm: RequestHandler = async (req, res, next) => {
  try {
    const perm = await Permission.findByIdAndDelete(req.params.id);
    if (!perm) {
      throw new BadReqErr("permission not found");
    }

    res.json({ msg: "deleted permission" });

    await Promise.all([
      Group.findByIdAndUpdate(perm.group, {
        $pull: { permissions: perm._id },
      }),
      new LogPublisher(nats.cli).publish({
        act: "DEL",
        model: Permission.modelName,
        doc: perm,
        userId: req.user?.id,
        status: true,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
