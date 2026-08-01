import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Extend the built-in session and JWT types to carry the Google ID token
declare module "next-auth" {
  interface Session {
    idToken?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Store the Google ID token in the JWT so we can forward it to our backend
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },

    // Expose idToken on the client-side session object
    async session({ session, token }) {
      session.idToken = token.idToken;
      return session;
    },
  },

  // After Google completes OAuth, send users to our bridge page
  pages: {
    signIn: "/", // If manual sign-in page is needed; we trigger it programmatically
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
