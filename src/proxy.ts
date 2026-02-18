import { NextRequest, NextResponse } from 'next/server';

type Rule = {
  pathPrefix: string;
  methods: string[];
  windowSec: number;
  max: number;
};

type Bucket = { count: number; resetAt: number };

const RULES: Rule[] = [
  { pathPrefix: '/api/v1/auth/register', methods: ['POST'], windowSec: 3600, max: 5 },
  { pathPrefix: '/api/v1/wiki/articles', methods: ['POST', 'PATCH'], windowSec: 600, max: 20 },
  { pathPrefix: '/api/v1/community/posts', methods: ['POST', 'PATCH', 'DELETE'], windowSec: 600, max: 40 },
  { pathPrefix: '/api/v1/reports', methods: ['POST', 'PATCH'], windowSec: 3600, max: 60 },
  { pathPrefix: '/api/v1/uploads', methods: ['POST', 'PATCH'], windowSec: 3600, max: 60 },
  { pathPrefix: '/api/v1/wiki/search', methods: ['GET'], windowSec: 60, max: 120 },
];

const buckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function findRule(pathname: string, method: string): Rule | null {
  for (const rule of RULES) {
    if (pathname.startsWith(rule.pathPrefix) && rule.methods.includes(method)) {
      return rule;
    }
  }
  return null;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();
  const rule = findRule(pathname, method);
  if (!rule) return NextResponse.next();

  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = rule.windowSec * 1000;
  const key = `${ip}:${method}:${rule.pathPrefix}`;

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return NextResponse.next();
  }

  if (existing.count >= rule.max) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return NextResponse.json(
      {
        error: 'Too many requests. Please retry later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
        },
      }
    );
  }

  existing.count += 1;
  buckets.set(key, existing);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
