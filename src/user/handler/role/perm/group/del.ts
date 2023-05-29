import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { Group } from "../../../../model/group";
import { Permission } from "../../../../model/permission";
import { nats } from "../../../../nats";

export const delGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      throw new BadReqErr("không tìm thấy group");
    }

    res.json({ msg: "xóa thành công" });

    await Promise.all([
      Permission.deleteMany({ _id: group.permissions }),
      new LogPublisher(nats.cli).publish({
        act: "DEL",
        model: Group.modelName,
        doc: group,
        userId: req.user?.id,
        status: true,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
