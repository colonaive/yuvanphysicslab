# Yuvan Physics Lab

A digital physics research site built with Next.js (App Router), TypeScript, Tailwind CSS, KaTeX, and MDX. Public pages are journal-style; a private lab workspace is also included.

## Features

- **Public Research Surface**: Home, featured paper, posts index, and post detail routes.
- **Math Ready**: Premium KaTeX integration for high-quality mathematical typesetting.
- **Private Lab**: Auth-gated writing workspace routes under `/lab`.
- **Contact Form**: Integrated with Netlify Forms for collaboration inquiries.
- **Supabase Scaffold**: Client/server helpers plus SQL migration for `posts` with RLS policies.
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
Create a `.env.local` file in the root directory and define these variable names:
- `LAB_PASSCODE`
- `LAB_SESSION_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for server-side writes)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

If you need local port `4100`, use:
```bash
npm run start:local
```

`npm run start` is production-only (`next start -p 4100`) and should not be used for local development.

## Deployment

### Netlify Deployment (Recommended)
This project is configured for Netlify deployment with `@netlify/plugin-nextjs`.

1. **GitHub**: Push your code to a GitHub repository.
2. **Netlify**: Connect your repository to a new site on Netlify.
3. **Environment Variables**: Add these names in Netlify site settings.
   - `LAB_PASSCODE`
   - `LAB_SESSION_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**: Build command is `npm run build`, and publish directory is automatically handled by `@netlify/plugin-nextjs`.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/content`: MDX content files for nodes and research.
- `src/lib`: Content loaders and utility functions.
- `src/lib/supabase`: Supabase browser/server/auth helpers.
- `src/components`: Reusable UI components.
- `supabase/migrations`: SQL migrations including `posts` schema + RLS.

## License
&copy; 2026 Yuvan. All rights reserved.
