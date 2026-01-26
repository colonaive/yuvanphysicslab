/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://yuvan-physics-lab.netlify.app',
    generateRobotsTxt: false, // We will use generic robots.ts for more control or keep it true if acceptable. Plan said manual robots.ts. 
    // actually user asked for robots.txt via generic file or package. 
    // Plan said "Create src/app/robots.ts"
}
