# AxelGamer.com Hugo Website

A Hugo-powered, static, Minecraft-inspired content website for **axelgamer.com** and **www.axelgamer.com**.

## Features

- Static site, easy to maintain
- Hugo-based content structure under `src/`
- Gaming / Minecraft-inspired original design
- YouTube embeds using `youtube-nocookie.com`
- Markdown-authored posts and section content
- SEO basics included
- Asset-based branding under `src/static/assets/`
- Docker and CI build the site before publishing

## Project structure

```text
.
├── src/
│   ├── content/
│   ├── layouts/
│   ├── static/
│   ├── hugo.toml
│   ├── styles.css
│   └── script.js
├── Dockerfile
├── docker-compose.yaml
├── .gitignore
├── AGENTS.md
├── TASKS.md
└── scripts/
    └── hugo-build-docker.sh
```

## Required assets

Place your real branding files in `src/static/assets/`:

- `src/static/assets/logo.png`
- `src/static/assets/favicon.ico`
- `src/static/assets/og-cover.jpg`

You can also add optional decorative textures or background images there.

## How to update videos

Add or edit Markdown entries in `src/content/sections/videos/`.

Each video uses front matter like this:

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

## How to update posts

Add Markdown files under `src/content/sections/posts/`.

You can use the `posts` archetype pattern:

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

## Local preview

Use Docker Compose for Hugo-based preview and validation.

### Live preview

```bash
docker compose up hugo
```

Then open:

```text
http://localhost:1313
```

### One-off Hugo build validation

```bash
docker compose run --rm hugo-build
```

You can also use:

```bash
./scripts/hugo-build-docker.sh
```

## Docker deployment

The production `Dockerfile` now uses Hugo directly as the runtime:

- The container serves the site with `hugo server`
- The Hugo source remains under `src/`
- The container listens on port `1313`
- The runtime base URL defaults to `https://www.axelgamer.com/` and can be overridden with `HUGO_BASEURL`
- TLS termination is expected to happen outside the container if needed

### Build

```bash
docker build -t axelgamer-site .
```

### Build and push to Docker Hub

```bash
docker build -t jatm80/ag-static-website:$(git rev-parse HEAD) .
docker push jatm80/ag-static-website:$(git rev-parse HEAD)
```

This builds the image from the repository root and pushes it as:

```text
jatm80/ag-static-website:<current git commit sha>
```

### GitLab CI

The repository includes a `.gitlab-ci.yml` pipeline with separate Hugo and image stages:

- `hugo_build`: runs `hugo --minify` inside `src/`
- `build_image`: builds the Hugo runtime image
- `build_and_push_image`: rebuilds and pushes the Hugo runtime image

Published image tag:

`jatm80/ag-static-website:<CI_COMMIT_SHA>`

Set these GitLab CI/CD variables before running the pipeline:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Optional GitLab CI/CD variable:

- `SERVER_NAME`

### Run

```bash
docker run --rm -p 1313:1313 axelgamer-site
```

To override the runtime base URL:

```bash
docker run --rm -p 1313:1313 -e HUGO_BASEURL=https://www.axelgamer.com/ axelgamer-site
```

For HTTPS, terminate TLS at your reverse proxy, load balancer, ingress, or hosting platform instead of inside the container.

## Deployment options

## Kubernetes deployment

Raw Kubernetes manifests are available in `infra/k8s/`:

- `infra/k8s/deployment.yaml`
- `infra/k8s/service.yaml`
- `infra/k8s/ingress.yaml`
- `infra/k8s/kustomization.yaml`

They deploy the site into the `axelgamer-site` namespace and expose it at `ag.jatm.link` through the `nginx-public` ingress class with cert-manager TLS annotations.
The pod serves Hugo on container port `1313`, and the Service exposes it internally on port `80`.

Argo CD should target `infra/k8s/` as a Kustomize application. The GitLab pipeline updates `infra/k8s/kustomization.yaml` so the deployed image tag matches `CI_PIPELINE_ID` with `CI_JOB_ID` as a fallback.

### Option 1: GitHub Pages

1. Create a GitHub repository.
2. Upload all files.
3. In GitHub repo settings, enable **Pages**.
4. Deploy from the main branch root.
5. Point your domain:
   - `axelgamer.com`
   - `www.axelgamer.com`

Recommended DNS:

- Apex domain: A/ALIAS/ANAME depending on DNS provider
- `www`: CNAME to your Pages hostname

### Option 2: Netlify

1. Create a new Netlify site from Git.
2. Build command: `hugo --minify --source src`
3. Publish directory: `src/public`
4. Add both custom domains in Netlify:
   - `axelgamer.com`
   - `www.axelgamer.com`

### Option 3: Cloudflare Pages

1. Connect repository.
2. Framework preset: Hugo
3. Build command: `hugo --minify --source src`
4. Output directory: `src/public`
5. Add both custom domains.

## SEO notes

This site includes:

- page title and description
- canonical URL
- Open Graph and Twitter tags
- JSON-LD structured data
- robots.txt
- sitemap.xml
- crawlable YouTube links
- semantic headings and accessible navigation

## Notes

- The site is intentionally original and only **inspired by** the references, not copied from them.
- The bundled container config lives under `scripts/docker/`.
- The video player uses this pattern:

```html
<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1&mute=1"
  allow="autoplay; encrypted-media"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen>
</iframe>
```

## Copyright

Copyright AxelGamer.com 2026
