/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yrcphysics.com',
    generateRobotsTxt: false, // We use src/app/robots.ts
    exclude: ['/lab*', '/api*'],
}
