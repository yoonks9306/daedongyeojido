import { NextResponse } from 'next/server';
import { createLocalAuthUser, getLocalAuthUserByEmail } from '@/lib/local-auth-users';

type RegisterBody = {
  email?: unknown;
  password?: unknown;
  username?: unknown;
};

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const username = typeof body.username === 'string' ? body.username.trim() : '';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }
  if (username.length < 2 || username.length > 40) {
    return NextResponse.json({ error: 'Username must be between 2 and 40 characters.' }, { status: 400 });
  }
  if (password.length < 8 || password.length > 72) {
    return NextResponse.json({ error: 'Password must be between 8 and 72 characters.' }, { status: 400 });
  }

  try {
    const existing = await getLocalAuthUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 });
    }

    const user = await createLocalAuthUser({ email, username, password });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
