// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../utils/db";

type User = {
  id: number;
  nonce: number;
  publicAddress: string;
  username?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const publicAddress: any = req.body.publicAddress;
  console.log("Query ::", publicAddress);
  const user = {
    wallet: {
      nonce: Math.floor(Math.random() * 10000),
      publicAddress: publicAddress,
      verified:false
    },
    twitter: null,
    discord: null,
  };
  await db.collection("users").doc(publicAddress).set(user);
  const docRef = await db.collection("users").doc(publicAddress);
  const doc = await docRef.get();
  console.log("Document ::", doc.data());
  res.status(200).json({ user: doc.data()!.wallet,success:true });
}
