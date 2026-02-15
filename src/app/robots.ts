import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://daedongyeojido.vercel.app/sitemap.xml',
    host: 'https://daedongyeojido.vercel.app',
  };
}
