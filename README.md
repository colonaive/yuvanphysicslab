# Yuvan Physics Lab

A digital garden exploring the intersection of Theoretical Physics, Geometry, and Machine Learning. Built with Next.js (App Router), Tailwind CSS, KaTeX, and MDX.

## Features

- **Digital Garden**: Combined feed of Notes and Research logs.
- **Math Ready**: Premium KaTeX integration for high-quality mathematical typesetting.
- **Private Lab**: Passcode-protected workspace for drafts and tools.
- **Contact Form**: Integrated with Netlify Forms for collaboration inquiries.
- **SEO Optimized**: Automated sitemaps, robots.txt, and optimized metadata.

## Local Development

### 1. Prerequisites
- Node.js 20+
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```bash
LAB_PASSCODE=your_secret_passcode_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deployment

### Netlify Deployment (Recommended)
This project is configured for one-click deployment to Netlify.

1. **GitHub**: Push your code to a GitHub repository.
2. **Netlify**: Connect your repository to a new site on Netlify.
3. **Environment Variables**: Add `LAB_PASSCODE` in the Netlify site settings (Site configuration > Environment variables).
4. **Deploy**: Build command is `npm run build`, and publish directory is automatically handled by `@netlify/plugin-nextjs`.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/content`: MDX content files for nodes and research.
- `src/lib`: Content loaders and utility functions.
- `src/components`: Reusable UI components.

## License
&copy; 2026 Yuvan. All rights reserved.
