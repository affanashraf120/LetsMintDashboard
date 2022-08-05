import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "firebase-admin";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const idToken: any = req.headers.authorization;
  console.log("Authorization Token", idToken);
  auth()
    .verifyIdToken(`${idToken}`)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log("TOKEN ::", decodedToken);
    })
    .catch((error) => {
      console.log("ERROR ID::", error);
    });
  res.status(200).json({ name: "John Doe" });
}
