# AxelGamer.com

Static Hugo website for **axelgamer.com** and **www.axelgamer.com**.

## What is in this repo

- Hugo site source under `src/`
- Markdown content for posts and videos
- Static assets under `src/static/assets/`
- GitHub Actions workflow for GitHub Pages deployment

## Project structure

```text
.
├── .github/workflows/github-pages.yml
├── src/
│   ├── content/
│   ├── layouts/
│   ├── static/
│   │   ├── CNAME
│   │   └── assets/
│   ├── hugo.toml
│   ├── styles.css
│   └── script.js
└── README.md
```

## Local preview

From the repository root:

```bash
cd src
hugo server
```

Then open:

```text
http://localhost:1313
```

## Build locally

```bash
cd src
hugo --minify
```

The static output is written to:

```text
src/public/
```

## Add or edit videos

Create or edit Markdown files in:

```text
src/content/sections/videos/
```

Example:

```toml
+++
title = "Video title"
type = "video"
video_id = "VIDEO_ID"
category = "Minecraft"
game = "Build Tips"
weight = 10
+++
```

## Add or edit posts

Create or edit Markdown files in:

```text
src/content/sections/posts/
```

Example:

```toml
+++
title = "Post title"
type = "posts"
date = 2026-04-11T10:00:00+10:00
draft = false
summary = "Short post summary"
slug = "post-title"
url = "/posts/post-title/"
+++
```

## GitHub Pages deployment

The workflow at `.github/workflows/github-pages.yml` runs on every push to `main`.

It:

1. Installs Hugo extended.
2. Builds the site from `src/` with `hugo --minify`.
3. Uploads `src/public` as the Pages artifact.
4. Deploys the static site to GitHub Pages.

The custom domain is configured by:

```text
src/static/CNAME
```

Current value:

```text
axelgamer.com
```

## DNS notes

For GitHub Pages custom domains:

- Apex domain: point `axelgamer.com` to GitHub Pages using the GitHub Pages A records, or ALIAS/ANAME if your DNS provider supports it.
- `www`: CNAME to `jatm80.github.io`.

## SEO

The site includes Hugo templates for:

- page titles and descriptions
- canonical links
- Open Graph and Twitter metadata
- JSON-LD structured data
- `robots.txt`
- `sitemap.xml`

## Copyright

Copyright AxelGamer.com 2026
