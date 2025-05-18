// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Worldcoin",
      credentials: {
        walletAddress: { label: "Wallet", type: "text" },
      },
      async authorize(credentials) {
        // Aquí puedes agregar validación personalizada si deseas
        const user = {
          id: credentials.walletAddress,
          name: credentials.walletAddress,
          email: `${credentials.walletAddress}@worldid.dev`, // ficticio
        };
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };
