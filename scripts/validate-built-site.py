#!/usr/bin/env python3
"""Validate generated Hugo output for SEO and internal-link regressions."""

from __future__ import annotations

import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

SITE_HOST = "axelgamer.com"
REQUIRED_NAVIGATION_LINKS = {
    "posts/index.html": {
        "/minecraft/potion-brewing-chart/",
        "/minecraft/potions/",
        "/minecraft/potions/fire-resistance/",
        "/minecraft/chaos-cubed/how-to-find-sulfur-caves/",
        "/nintendo/is-kirby-and-the-forgotten-land-two-player/",
    },
    "minecraft/index.html": {
        "/minecraft/potion-brewing-chart/",
        "/minecraft/potions/",
        "/minecraft/potions/fire-resistance/",
        "/minecraft/chaos-cubed/",
    },
    "minecraft/potions/index.html": {
        "/minecraft/potion-brewing-chart/",
        "/posts/minecraft-night-vision-potion-beginner-guide/",
        "/minecraft/potions/water-breathing/",
        "/minecraft/potions/fire-resistance/",
        "/minecraft/potions/invisibility/",
        "/minecraft/potions/strength/",
    },
}
REQUIRED_SITEMAP_PATHS = {
    "/minecraft/potion-brewing-chart/",
    "/videos/",
    "/games/",
    "/games/snake/",
    "/games/banana-battle/",
    "/games/perfect-landing/",
    "/minecraft/",
    "/nintendo-switch/",
    "/roblox/",
}


class ReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []
        self.links: list[str] = []
        self.json_ld: list[str] = []
        self._json_ld_parts: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "a" and values.get("href"):
            self.links.append(values["href"] or "")
        if tag in {"a", "link"} and values.get("href"):
            self.references.append(values["href"] or "")
        if tag in {"img", "script", "iframe", "source", "video"} and values.get("src"):
            self.references.append(values["src"] or "")
        if values.get("poster"):
            self.references.append(values["poster"] or "")
        if values.get("srcset"):
            self.references.extend(
                candidate.strip().split()[0]
                for candidate in (values["srcset"] or "").split(",")
                if candidate.strip()
            )
        if tag == "script" and (values.get("type") or "").lower() == "application/ld+json":
            self._json_ld_parts = []

    def handle_data(self, data: str) -> None:
        if self._json_ld_parts is not None:
            self._json_ld_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._json_ld_parts is not None:
            self.json_ld.append("".join(self._json_ld_parts).strip())
            self._json_ld_parts = None


def local_target(public: Path, source: Path, reference: str) -> Path | None:
    if not reference or reference.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
        return None
    parsed = urlsplit(reference)
    hostname = (parsed.hostname or "").lower()
    if parsed.netloc and hostname not in {SITE_HOST, f"www.{SITE_HOST}"}:
        return None
    if parsed.scheme and parsed.scheme not in {"http", "https"}:
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    target = public / path.lstrip("/") if path.startswith("/") else source.parent / path
    if path.endswith("/"):
        target /= "index.html"
    elif target.is_dir():
        target /= "index.html"
    target = target.resolve()
    try:
        target.relative_to(public)
    except ValueError:
        raise ValueError(f"reference escapes generated site: {reference}") from None
    return target


def safe_generated_file(public: Path, path: Path) -> bool:
    """Return true only for a regular, non-symlinked file contained in public."""
    if path.is_symlink() or not path.is_file():
        return False
    try:
        path.resolve().relative_to(public)
    except ValueError:
        return False
    return True


def main() -> int:
    public = Path(sys.argv[1] if len(sys.argv) > 1 else "public").resolve()
    if not safe_generated_file(public, public / "index.html"):
        print(f"ERROR: generated site not found or unsafe at {public}", file=sys.stderr)
        return 2

    errors: list[str] = []
    html_files = sorted(public.rglob("*.html"))
    unsafe_html = [path for path in html_files if not safe_generated_file(public, path)]
    for path in unsafe_html:
        errors.append(f"unsafe generated HTML file: {path.relative_to(public)}")
    html_files = [path for path in html_files if safe_generated_file(public, path)]
    json_ld_count = 0
    reference_count = 0

    for source in REQUIRED_NAVIGATION_LINKS:
        if not safe_generated_file(public, public / source):
            errors.append(f"missing or unsafe navigation page: {source}")

    for html_file in html_files:
        parser = ReferenceParser()
        parser.feed(html_file.read_text(encoding="utf-8"))
        source = html_file.relative_to(public).as_posix()
        link_paths = {
            urlsplit(link).path
            for link in parser.links
            if not urlsplit(link).netloc
            or urlsplit(link).hostname in {SITE_HOST, f"www.{SITE_HOST}"}
        }
        for required in sorted(REQUIRED_NAVIGATION_LINKS.get(source, set()) - link_paths):
            errors.append(f"missing navigation link: {source} -> {required}")
        for index, block in enumerate(parser.json_ld, start=1):
            json_ld_count += 1
            try:
                json.loads(block)
            except json.JSONDecodeError as exc:
                errors.append(f"invalid JSON-LD: {html_file.relative_to(public)} block {index}: {exc}")
        for reference in parser.references:
            try:
                target = local_target(public, html_file, reference)
            except ValueError as exc:
                errors.append(f"unsafe internal reference: {html_file.relative_to(public)} -> {exc}")
                continue
            if target is None:
                continue
            reference_count += 1
            if not target.exists():
                errors.append(
                    f"broken internal reference: {html_file.relative_to(public)} -> {reference}"
                )

    if json_ld_count == 0:
        errors.append("no JSON-LD blocks found")

    sitemap_file = public / "sitemap.xml"
    if not safe_generated_file(public, sitemap_file):
        errors.append("missing or unsafe sitemap.xml")
    else:
        try:
            root = ElementTree.parse(sitemap_file).getroot()
            namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            sitemap_paths = {
                urlsplit(node.text or "").path for node in root.findall("sm:url/sm:loc", namespace)
            }
        except ElementTree.ParseError as exc:
            errors.append(f"invalid sitemap.xml: {exc}")
            sitemap_paths = set()
        for path in sorted(REQUIRED_SITEMAP_PATHS - sitemap_paths):
            errors.append(f"required sitemap URL missing: {path}")
        if any(path.startswith("/sections/") for path in sitemap_paths):
            errors.append("helper-only /sections/ URL found in sitemap")

    if errors:
        print("Generated-site validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(
        f"Validated {len(html_files)} HTML files, "
        f"{json_ld_count} JSON-LD blocks, and {reference_count} internal references."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
