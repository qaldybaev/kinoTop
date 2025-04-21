import { promises as fs } from "fs";
import multer from "multer";
import { join } from "path";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const ext = file.mimetype.split("/")[0];
    const folder =
      ext === "image" ? "images" : ext === "video" ? "videos" : "others";
    const uploadDir = join(process.cwd(), `src/uploads/${folder}`);

    try {
      await fs.access(uploadDir);
    } catch (error) {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + `.${file.mimetype.split("/")[1]}`
    );
  },
});

export const upload = multer({ storage });
