# TASKS.md

## Goal

Move the current production site from a basic static implementation to Hugo, keep the same style and layout, and add an articles/posts section with Markdown-managed content under `src/content/sections/`.

## Phase 1 — Baseline and migration setup

### Task 1.1 — Capture the current site structure
- Inventory the current homepage sections, shared assets, scripts, and SEO files.
- Record what must stay visually identical after the migration.
- Identify which current files map into Hugo layouts, partials, static assets, and content files.

### Task 1.2 — Create the Hugo project structure in `src/`
- Set up Hugo configuration and standard folders inside `src/`.
- Keep Hugo source code rooted in `src/`.
- Define where layouts, partials, static files, and generated content will live.

### Task 1.3 — Define the content model
- Establish front matter conventions for homepage sections, videos, and posts.
- Keep Markdown content under `src/content/sections/`.
- Keep the structure simple enough for manual editing without extra tooling.

## Phase 2 — Preserve the current design in Hugo

### Task 2.1 — Move shared page chrome into templates
- Convert the current header, footer, metadata shell, and shared includes into Hugo templates or partials.
- Preserve current class names and styling where possible.

### Task 2.2 — Reuse the current styling and assets
- Keep the current CSS and JS behavior unless a change is required for Hugo integration.
- Ensure assets from `assets/` still resolve correctly after the migration.

### Task 2.3 — Rebuild the homepage with Hugo
- Recreate the existing homepage layout using Hugo templates and content-driven sections.
- Keep section order, spacing, and presentation aligned with the current production site.

## Phase 3 — Content-driven sections

### Task 3.1 — Convert homepage content into Markdown-managed sections
- Move editable homepage content into Markdown files under `src/content/sections/`.
- Keep content structure easy to extend without touching templates for routine updates.

### Task 3.2 — Convert the video gallery to Hugo-managed content
- Decide whether video entries live as section content, data, or a simple content collection.
- Preserve the existing gallery layout and playback behavior.
- Keep maintenance simple for adding or reordering videos later.

### Task 3.3 — Add the new articles/posts section
- Create a Hugo list page for articles.
- Create a Hugo single page template for individual posts.
- Add at least one example post under `src/content/sections/`.

## Phase 4 — SEO and metadata

### Task 4.1 — Move metadata into Hugo templates
- Generate title, description, canonical, Open Graph, and Twitter metadata from Hugo templates and front matter.
- Preserve current production URLs and domain handling.

### Task 4.2 — Keep crawlability intact
- Ensure `robots.txt` and `sitemap.xml` are generated or copied correctly in the Hugo output.
- Confirm article pages are included in the final site map.

### Task 4.3 — Add structured data where useful
- Preserve or improve existing JSON-LD support.
- Ensure homepage and article pages expose clean structured metadata.

## Phase 5 — Build and deployment updates

### Task 5.1 — Update the Dockerfile for Hugo
- Change the Docker build so Hugo compiles the site first.
- Serve only the generated Hugo output in the final runtime image.
- Keep the runtime image simple and production-friendly.

### Task 5.2 — Update the pipeline
- Add a pipeline step to build the Hugo site before packaging or publishing.
- Ensure the publish flow uses generated static output rather than raw `src/` template files.
- Keep the pipeline easy to understand and maintain.

### Task 5.3 — Document the new workflow
- Update deployment and maintenance notes.
- Explain how to run Hugo locally.
- Explain how to add or edit Markdown content in `src/content/sections/`.
- Explain how Docker and CI now build and publish the site.

## Phase 6 — Validation and release readiness

### Task 6.1 — Visual regression check
- Compare the Hugo site against the current production layout.
- Fix noticeable layout or styling drift before release.

### Task 6.2 — Content and routing check
- Verify homepage, video gallery, article list, and article pages render correctly.
- Verify internal links, canonical URLs, and asset paths.

### Task 6.3 — Build and deployment verification
- Verify local Hugo build output is correct.
- Verify Docker serves the generated site successfully.
- Verify the pipeline can build and publish the Hugo version cleanly.
