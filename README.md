# Arnav Harshit · Portfolio

Personal portfolio of **Arnav Harshit**: systems and AI engineer, IIT Kanpur.

**Live site: [dangerwizard-world.vercel.app](https://dangerwizard-world.vercel.app)**

Built with Next.js 15, Tailwind CSS 4 and Framer Motion.

## Features

- **Bit**, an SVG robot that follows your cursor, blinks, waves, talks and falls asleep when idle
- AI terminal: ask questions about me in plain English, plus built-in commands like `help` and `projects`
- `Ctrl + K` command menu, custom cursor, scroll animations, 3D tilt cards
- Project case-study pages, resume viewer, custom 404
- Blog with a password-protected editor at `/admin` (only the owner can write)
- Dark / light theme, fully responsive, reduced-motion friendly, SEO metadata and sitemap

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Editing content

All resume content lives in [`src/data/resume.ts`](src/data/resume.ts). Blog posts are Markdown files in [`content/blog`](content/blog), written through `/admin` or by hand.

## Environment variables

See [`.env.example`](.env.example). Everything is optional:

| Variable | Enables |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Correct link previews and sitemap |
| `ANTHROPIC_API_KEY` | AI answers in the terminal |
| `ADMIN_PASSWORD` | The `/admin` blog editor (12+ characters) |
| `GITHUB_TOKEN`, `GITHUB_REPO` | Publishing blog posts from `/admin` on the live site |
| `NEXT_PUBLIC_FORMSPREE_ID` | Contact form delivery without opening a mail app |

## Deploy

Deployed on [Vercel](https://vercel.com) at https://dangerwizard-world.vercel.app. Every push to `main` redeploys automatically.
