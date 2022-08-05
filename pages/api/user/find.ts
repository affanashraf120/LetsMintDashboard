import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../utils/db";
import { auth } from "firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: any = {
    wallet: null,
    twitter: null,
    discord: null,
  };
  const userToken: any = req.headers.authorization;
  if (!userToken) {
    res.status(200).json({ user: undefined, message: "Token not found" });
    return;
  }
  auth()
    .verifyIdToken(`${userToken}`)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      if (uid) {
        console.log("TOKEN ::", decodedToken);
        const docRef = await db.collection("users").doc(uid);
        const doc = await docRef.get();
        if (doc.exists) {
          const data = doc.data()!;
          user = {
            ...user,
            wallet: data.wallet,
          };
          const twitter = data.twitter;
          const discord = data.discord;

          return res.status(200).json({
            user,
            success: true,
            message: "wallet fetched!",
          });
        } else {
          return res
            .status(200)
            .json({ user: null, success: false, message: "User not found!" });
        }
      }
    })
    .catch((error) => {
      console.log("ERROR ID::", error.message);
      return res
        .status(401)
        .json({ user: null, success: false, message:error.message });
    });
}
