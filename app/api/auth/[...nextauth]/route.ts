import NextAuth, { NextAuthOptions } from 'next-auth';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email w_member_social',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === 'linkedin') {
        try {
          const linkedinId = account.providerAccountId;
          
          // Find or create user
          const existingUser = await prisma.user.findUnique({
            where: { linkedinId },
          });

          if (existingUser) {
            // Update tokens
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                linkedinAccessToken: account.access_token,
                linkedinRefreshToken: account.refresh_token,
                tokenExpiresAt: account.expires_at
                  ? new Date(account.expires_at * 1000)
                  : null,
                name: user.name || profile?.name,
                email: user.email || profile?.email,
                profilePicture: user.image,
              },
            });
          } else {
            // Create new user
            await prisma.user.create({
              data: {
                linkedinId,
                linkedinAccessToken: account.access_token,
                linkedinRefreshToken: account.refresh_token,
                tokenExpiresAt: account.expires_at
                  ? new Date(account.expires_at * 1000)
                  : null,
                name: user.name || profile?.name,
                email: user.email || profile?.email,
                profilePicture: user.image,
                headline: (profile as any)?.headline,
              },
            });
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.linkedinId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.linkedinId) {
        const dbUser = await prisma.user.findUnique({
          where: { linkedinId: token.linkedinId as string },
        });
        
        if (dbUser) {
          session.user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.profilePicture,
            headline: dbUser.headline,
          };
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

