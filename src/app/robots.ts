import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/lab/', '/api/'],
        },
        sitemap: 'https://yuvan.xyz/sitemap.xml', // Update with real domain later? user didn't specify production domain.
        // User goal: "Push Netlify deploy" - likely uses netlify.app subdomain initially. 
    };
}
