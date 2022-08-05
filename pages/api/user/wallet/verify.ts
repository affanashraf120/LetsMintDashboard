import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../utils/db";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { auth } from "firebase-admin";

/**
 * JWT config.
 */
const config = {
  algorithms: ["HS256" as const],
};

type Data = {
  success: boolean;
  message: null | string;
  accessToken: null | string;
};

type User = {
  id: number;
  nonce: number;
  publicAddress: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { signature, publicAddress } = req.body;
  const docRef = await db.collection("users").doc(publicAddress);

  if (!signature || !publicAddress)
    return res.status(400).send({
      success: false,
      message: "Request should have signature and publicAddress",
      accessToken: null,
    });

  docRef
    .get()
    .then((doc) => {
      console.log("Document exist", doc.exists);
      if (!doc.exists) {
        throw `User with publicAddress ${publicAddress} is not found in database`;
      }
      const user: any = {
        nonce: doc.data()!.nonce,
        publicAddress: doc.data()!.publicAddress,
      };
      return doc.data()!.wallet;
    })
    .then((user: User) => {
      if (user.nonce) {
        const msg: string = `I am signing my one-time nonce: ${user.nonce}`;
        const msgBufferHex: string = bufferToHex(Buffer.from(msg, "utf8"));
        const address: string = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature,
        });
        if (address.toLowerCase() === publicAddress.toLowerCase()) return user;
        else throw "Signature verification failed";
      } else throw 'User is not defined in "Verify digital signature".';
    })
    .then(async (user: User | undefined) => {
      console.log("Last User", user);
      if (user!.nonce) {
        await docRef.update({
          wallet: {
            nonce: Math.floor(Math.random() * 10000),
            verified: true,
            publicAddress,
          },
        });
        return true;
      } else
        throw 'User is not defined in "Generate a new nonce for the user".';
    })
    .then(async (updated: boolean | undefined) => {
      if (updated) {
        return docRef.get().then((data) => {
          const user: any = data.data();
          return auth()
            .createCustomToken(publicAddress)
            .then((token) => token)
            .catch((error) => {
              throw "Custom token not generated";
            });
        });
      }
    })
    .then((accessToken: any) => {
      if (accessToken)
        res.json({ success: true, message: null, accessToken: accessToken! });
      else throw "Access token not generated";
    })
    .catch((message) => {
      res.status(500).json({ success: false, message, accessToken: null });
    });
}
