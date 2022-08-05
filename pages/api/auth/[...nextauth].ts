import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET,
      }),
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
      }),
    ],
    secret: process.env.SECRET,

    session: {
      strategy: "jwt",
    },
    jwt: {
      // secret: process.env.SECRET,
    },
    pages: {},
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        return true;
      },
      async redirect({ url, baseUrl }) {
        return baseUrl;
      },
      async session({ session, user, token }) {
        const provider = token.provider;
        const account = token.account;
        session[`${provider}`] = { ...session.user, account };
        // const cookies = new Cookies(req, res);
        // console.log("SESSION", session);
        // // Set a cookie
        // let cookie = cookies.get("sessions");
        // if (cookie) {
        //   const tempSession = JSON.parse(cookies.get("sessions")!);
        //   const newSession = { ...tempSession, ...session };
        //   cookies.set("sessions", JSON.stringify(newSession), {
        //     httpOnly: true, // true by default
        //   });
        //   return newSession;
        // } else {
        //   cookies.set("sessions", JSON.stringify(session), {
        //     httpOnly: true, // true by default
        //   });
        // }
        return session;
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        console.log("Account :: ", account);
        console.log("Auth Token :: ", token);
        if (account) {
          token.provider = account.provider;
          token.account = account;
        }
        return token;
      },
    },
    events: {},
    debug: false,
  });
}
