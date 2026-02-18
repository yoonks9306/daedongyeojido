import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { verifyLocalAuthUserCredentials } from '@/lib/local-auth-users';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if (!email || !password) return null;

        const user = await verifyLocalAuthUserCredentials({ email, password });
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase() ?? null;
      if (!email) return false;

      const subject = user.id ?? `email:${email}`;

      const { data: bySubject } = await supabaseAdmin
        .from('user_identities')
        .select('supabase_user_id')
        .eq('nextauth_subject', subject)
        .maybeSingle<{ supabase_user_id: string }>();

      const identity = bySubject ?? (
        await supabaseAdmin
          .from('user_identities')
          .select('supabase_user_id')
          .eq('email', email)
          .maybeSingle<{ supabase_user_id: string }>()
      ).data;

      if (!identity?.supabase_user_id) return true;

      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('deleted_at, banned_until')
        .eq('user_id', identity.supabase_user_id)
        .maybeSingle<{ deleted_at: string | null; banned_until: string | null }>();

      if (!profile) return true;
      if (profile.deleted_at) return false;
      if (profile.banned_until) {
        const until = new Date(profile.banned_until).getTime();
        if (Number.isFinite(until) && until > Date.now()) {
          return false;
        }
      }

      return true;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
