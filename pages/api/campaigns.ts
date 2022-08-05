import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  assoc,
  assocPath,
  complement,
  has,
  isEmpty,
  mapObjIndexed,
  pipe,
  prop,
} from "ramda";
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

      const campaign = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          if (!err) {
            try {
              let campaign = JSON.parse(fields.campaign as string);
              if (complement(isEmpty)(files)) {
                if (has("profile")(files)) {
                  await uploadFileToS3(files["profile"] as formidable.File)
                    .then((e) => {
                      campaign = assocPath(
                        ["page_customization", "images", "profile"],
                        e.Location
                      )(campaign);
                    })
                    .catch((err) => reject(err));
                }

                if (has("banner")(files)) {
                  await uploadFileToS3(files["banner"] as formidable.File)
                    .then((e) => {
                      campaign = assocPath(
                        ["page_customization", "images", "banner"],
                        e.Location
                      )(campaign);
                    })
                    .catch((err) => reject(err));
                }

                return resolve(campaign);
              } else {
                return resolve(campaign);
              }
            } catch (error) {
              return reject(error);
            }
          }
          return reject(err);
        });
      });

      await db
        .collection("campaigns")
        .doc()
        .set(assoc("primary_campaign", false)(campaign));

      res.status(200).json({ success: true });
    } else if (req.method === "PUT") {
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

      const data: any = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          const action = fields.action;

          if (!err) {
            try {
              switch (action) {
                case "SET_PRIMARY_CAMPAIGN":
                  return resolve(fields);
                case "EDIT_CAMPAIGN":
                  let campaign = JSON.parse(fields.campaign as string);
                  if (complement(isEmpty)(files)) {
                    if (has("profile")(files)) {
                      await uploadFileToS3(files["profile"] as formidable.File)
                        .then((e) => {
                          campaign = assocPath(
                            ["page_customization", "images", "profile"],
                            e.Location
                          )(campaign);
                        })
                        .catch((err) => reject(err));
                    }

                    if (has("banner")(files)) {
                      await uploadFileToS3(files["banner"] as formidable.File)
                        .then((e) => {
                          campaign = assocPath(
                            ["page_customization", "images", "banner"],
                            e.Location
                          )(campaign);
                        })
                        .catch((err) => reject(err));
                    }

                    return resolve({
                      ...fields,
                      campaign: campaign,
                    });
                  } else {
                    return resolve({
                      ...fields,
                      campaign: campaign,
                    });
                  }
              }
              return reject("No Such Request");
            } catch (error) {
              return reject(error);
            }
          }
          return reject(err);
        });
      });

      switch (data.action) {
        case "SET_PRIMARY_CAMPAIGN":
          const campaignId = data.id;
          const projectId = data.projectId;

          console.log(campaignId, projectId);

          const querySnapshot = await db
            .collection("campaigns")
            .where("project_id", "==", projectId)
            .get();

          querySnapshot.forEach((doc) => {
            if (doc.id === campaignId) {
              doc.ref.update({
                primary_campaign: true,
              });
            } else {
              doc.ref.update({
                primary_campaign: false,
              });
            }
          });

          return res.status(200).json({ success: true });
        case "EDIT_CAMPAIGN":
          const campaign = data.campaign;
          const id = data.id;

          await db
            .collection("campaigns")
            .doc(id)
            .update({
              ...campaign,
            });

          console.log(id, campaign);
          return res.status(200).json({ success: true });
      }
    } else if (req.method === "DELETE") {
      const {
        query: { id },
      } = req;

      await db
        .collection("campaigns")
        .doc(id as string)
        .delete();

      return res.status(200).json({ success: true });
    } else {
      const {
        query: { projectId },
      } = req;
      if (projectId) {
        const querySnapshot = await db
          .collection("campaigns")
          .where("project_id", "==", projectId)
          .get();
        const campaigns: any[] = [];
        querySnapshot.forEach((doc) =>
          campaigns.push({ id: doc.id, ...doc.data() })
        );
        return res.status(200).json({ campaigns, success: true });
      }
      const querySnapshot = await db.collection("campaigns").get();
      const campaigns: any[] = [];
      querySnapshot.forEach((doc) =>
        campaigns.push({ id: doc.id, ...doc.data() })
      );
      res.status(200).json({ campaigns, success: true });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
}
