import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "./db";

export const authOptions : NextAuthOptions ={
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages:{
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text"},
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if(!credentials?.username || !credentials?.password){
                return null;
            }
            
            const existingUser = await db.query('SELECT * FROM users WHERE username = $1', [credentials.username]);
            if(existingUser.rows.length == 0){return null;}
            
            const passwordMatch = await compare(credentials.password, existingUser.rows[0].password);
            if(!passwordMatch){return null;}

            return{
                id: existingUser.rows[0].id + '',
                username: existingUser.rows[0].username,
            }
          }
        })
      ],
      callbacks:{
        async jwt({ token, user, }) {
          if (user) {
            return{
              ...token, 
              username : user.username
            }
          }
          return token
        },
        async session({ session, token }) {
          return{
            ...session,
            user: {
              ...session.user,
              username: token.username
            }
          }
        },
      }

}