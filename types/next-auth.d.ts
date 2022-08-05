import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

/** Example on how to extend the built-in session types */
// declare module "next-auth" {
//   interface Session {
//     /** This is an example. You can find me in types/next-auth.d.ts */
//     foo: string
//   }
// }

/** Example on how to extend the built-in types for JWT */
// declare module "next-auth/jwt" {
//   interface DiscordGuilds {
//     /** This is an example. You can find me in types/next-auth.d.ts */
//     id: string,
//     name: string,
//     icon: string,
//     owner: string,
//     permissions: '4398046511103',
//     features: [ 'EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT' ]
//   }
  
// }
