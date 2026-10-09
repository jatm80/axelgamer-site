# Minecraft Potion Brewing Chart

Original layout and bottle illustrations created for AxelGamer. No game textures,
third-party screenshots or copied chart artwork are included.

- PNG: 3508 × 4961 pixels, suitable for an A3 print at approximately 300 dpi.
- PDF: one A3 portrait page with vector text and illustrations; use fit-to-page for A4.
- SVG: editable vector source and lightweight, crisp browser preview.

Recipes and source links live in `src/data/potion_chart.json`. The Hugo resource
page reads that same data for accessible, mobile-friendly recipe cards.
Regenerate all exports from the repository root with:

```sh
python3 scripts/generate-potion-chart.py
```

Requires Python 3, `rsvg-convert` (librsvg), and DejaVu Sans fonts. Export files are
committed so a Hugo build does not need the illustration tools installed.

Resource page: https://axelgamer.com/minecraft/potion-brewing-chart/

Checked 9 October 2026. Scope: vanilla Survival brewing in Java and Bedrock 1.21+;
table durations are displayed drinkable-potion timers. Recheck the recipe data
when game updates change brewing. The chart may be shared unmodified with its
AxelGamer credit and website address intact.
