import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { assoc, assocPath, dissoc, pipe } from "ramda";
import db from "../../utils/db";
import { uploadFileToS3 } from "../../utils/s3";
import tmp from "tmp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const tempRepo = tmp.dirSync({ unsafeCleanup: true });
      const form = new formidable.IncomingForm({
        uploadDir: tempRepo.name,
        keepExtensions: true,
        multiples: true,
      });
      res.on("finish", () => {
        tempRepo.removeCallback();
      });
      res.on("error", () => {
        tempRepo.removeCallback();
      });

      await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          if (!err) {
            try {
              const project = pipe(
                dissoc("discord_name"),
                dissoc("discord_url"),
                dissoc("discord_server_id"),
                assocPath(["discord", "name"], fields.discord_name),
                assocPath(["discord", "url"], fields.discord_url),
                assocPath(["discord", "server_id"], fields.discord_server_id)
              )(fields);

              const profileImage = await uploadFileToS3(
                files.profile_image as formidable.File
              );
              const bannerImage = await uploadFileToS3(
                files.banner_image as formidable.File
              );

              await db
                .collection("projects")
                .doc()
                .set(
                  pipe(
                    assoc("creater_pass", false),
                    assoc("profile_image", profileImage.Location),
                    assoc("banner_image", bannerImage.Location)
                  )(project)
                );
              resolve("");
            } catch (error) {
              reject(error);
            }
          }
        });
      });

      res.status(200).json({ success: true });
    } else {
      const querySnapshot = await db.collection("projects").get();
      const projects: any[] = [];
      querySnapshot.forEach((doc) =>
        projects.push({ id: doc.id, ...doc.data() })
      );
      res.status(200).json({ projects, success: true });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
}
