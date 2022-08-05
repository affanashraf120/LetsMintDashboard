import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const publicAddress: any = req.query.publicAddress;
  if (!publicAddress) {
    res
      .status(200)
      .json({ user: undefined, message: "Public address not found" });
    return;
  }

  const docRef = await db.collection("users").doc(publicAddress);
  return docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        res
          .status(200)
          .json({
            user: doc.data()!.wallet,
            message: "User exist",
            success: true,
          });
      } else {
        res
          .status(200)
          .json({ user: null, message: "User not found", success: false });
      }
    })
    .catch((error) => {
      res.status(200).json({ user: null, message: error, success: false });
    });
}
