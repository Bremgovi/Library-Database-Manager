import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
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
            username: { label: "username", type: "text"},
            password: { label: "password", type: "password" }
          },
          async authorize(credentials) {
            if(!credentials?.username || !credentials?.password){
                return null;
            }
            const existingUser = await db.query('SELECT * FROM usuarios WHERE usuario = $1', [credentials.username]);
            if(existingUser.rows.length == 0){return null;}
            const passwordMatch = await compare(credentials.password, existingUser.rows[0].contrasena);
            if(!passwordMatch){return null;}
            
            return{
                  id: existingUser.rows[0].id_usuario + '',
                  username: existingUser.rows[0].usuario
            }
          }
        })
      ],
      
      callbacks:{
        async jwt({ token, user, }) {
          if (user) {
            return{
              ...token, 
              username : user.username,
            }
          }
          return token
        },
        async session({ session, token }) {
          return{
            ...session,
            user: {
              ...session.user,
              username: token.username,
            }
          }
        },
      }

}