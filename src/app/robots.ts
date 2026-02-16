import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yrcphysics.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/lab/', '/api/lab/', '/api/auth/'],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
