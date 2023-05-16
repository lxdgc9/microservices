import { existsSync, mkdir } from "fs";
import multer, { diskStorage } from "multer";

export const uploader = (path: string = "/") => {
  const dest = `uploads/${path}`;

  if (!existsSync(dest)) {
    mkdir(dest, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Directory created successfully!");
    });
  }

  return multer({
    storage: diskStorage({
      destination(_req, _file, cb) {
        cb(null, dest);
      },
      filename(_req, file, cb) {
        if (!file) {
          console.log("no file received");
          throw new Error("no file received");
        }

        file.originalname = Buffer.from(
          file.originalname,
          "latin1"
        ).toString("utf8");
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    limits: {
      fileSize: 1258291200, // ~1.2G
    },
  });
};
