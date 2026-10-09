#!/usr/bin/env python3
"""Render the original potion poster from the same data used by its Hugo page.

Requires rsvg-convert (librsvg). Produces an A3 SVG, 3508×4961 PNG and vector PDF.
All illustration paths and layout are original; no game textures are embedded.
"""

import json
import subprocess
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "src/data/potion_chart.json").read_text())
OUT = ROOT / "src/static/assets/minecraft/potion-brewing-chart"
INK, MUTED, GREEN = "#172e30", "#526b6c", "#286449"
PARTS = []


def rect(x, y, w, h, fill, radius=0, stroke="none"):
    PARTS.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}"/>')


def text(x, y, value, size=22, fill=INK, weight=400, anchor="start"):
    PARTS.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" text-anchor="{anchor}">{escape(value)}</text>')


def arrow(x1, y, x2, label=""):
    PARTS.append(f'<path d="M{x1} {y} H{x2}" stroke="{GREEN}" stroke-width="3" fill="none" marker-end="url(#arrow)"/>')
    if label:
        text((x1 + x2) / 2, y - 47, label, 19, GREEN, 700, "middle")


def bottle(x, y, colour, scale=1):
    PARTS.append(f'<g transform="translate({x} {y}) scale({scale})">')
    PARTS.append('<path d="M11 0 H27 V13 L34 20 V40 Q34 47 27 47 H11 Q4 47 4 40 V20 L11 13 Z" fill="#fff" stroke="#425e60" stroke-width="2"/>')
    PARTS.append(f'<path d="M7 27 H31 V40 Q31 44 27 44 H11 Q7 44 7 40 Z" fill="{colour}"/>')
    rect(10, 0, 18, 5, "#a67a48", 1)
    PARTS.append('<path d="M11 24 V36" stroke="#fff" stroke-opacity=".75" stroke-width="3" stroke-linecap="round"/>')
    PARTS.append('</g>')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PARTS.append('<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="420mm" viewBox="0 0 1400 1980" role="img" aria-labelledby="title desc">')
    PARTS.append('<title id="title">Minecraft Potion Brewing Chart</title><desc id="desc">A complete Survival brewing reference: nineteen effect potions, bases, effect ingredients, duration extensions, strength upgrades and Java/Bedrock differences. Read the accessible recipe cards at axelgamer.com/minecraft/potion-brewing-chart/.</desc>')
    PARTS.append(f'<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="{GREEN}"/></marker></defs>')
    PARTS.append('<g font-family="DejaVu Sans, sans-serif">')
    rect(0, 0, 1400, 1980, "#ffffff")
    rect(0, 0, 1400, 12, GREEN)
    text(60, 65, "AXELGAMER  /  FIELD GUIDE 01", 21, GREEN, 700)
    text(60, 125, "MINECRAFT", 55, INK, 800)
    text(60, 186, "POTION BREWING CHART", 55, INK, 800)
    text(60, 226, "19 Survival recipes • Java + Bedrock • Drinkable potion timers", 25, MUTED)
    for x, colour in [(1190, "#719bc8"), (1240, "#ce8144"), (1290, "#70a268")]:
        bottle(x, 119, colour, 1.15)

    # The main flow is a true left-to-right sequence, with the fuel separate.
    rect(60, 257, 1280, 154, "#edf5ef", 16)
    text(82, 287, "01  START HERE", 19, GREEN, 700)
    text(82, 322, "Fuel the stand", 22, INK, 700)
    text(82, 351, "Blaze powder", 21, MUTED)
    text(82, 383, "1 powder = 20 brews", 18, MUTED)
    for x, title, subtitle, colour in [
        (355, "Water bottles", "Fill 1–3 bottle slots", "#709ec7"),
        (760, "Awkward Potion", "The base for 15 recipes", "#bcced4"),
        (1110, "Effect potion", "Choose a row below", "#61a475"),
    ]:
        bottle(x, 308, colour)
        text(x + 47, 330, title, 20, INK, 700)
        text(x + 47, 361, subtitle, 16, MUTED)
    arrow(588, 337, 734, "+ Nether wart")
    arrow(1040, 337, 1087, "+ ingredient")
    text(355, 393, "Stand: 1 blaze rod + 3 cobblestone • Bottles: 3 glass → 3 bottles", 18, MUTED)
    text(60, 447, "02  PICK YOUR POTION", 23, GREEN, 700)
    text(1340, 447, "J = Java  •  B = Bedrock  •  — = no upgrade", 19, MUTED, 400, "end")

    # Timers are deliberately labelled as drinkable, not splash/lingering.
    top, row_h = 467, 49
    rect(60, top, 1280, 55, INK, 9)
    for x, label in [(78, "POTION"), (343, "ADD THIS INGREDIENT"), (666, "NORMAL"), (816, "+ REDSTONE"), (1078, "+ GLOWSTONE")]:
        text(x, top + 34, label, 18, "#fff", 700)
    for i, recipe in enumerate(DATA["recipes"]):
        y = top + 55 + i * row_h
        special = recipe["base"] != "Awkward"
        fill = "#f2eef8" if special else ("#f4f7f5" if i % 2 == 0 else "#fff")
        rect(60, y, 1280, row_h, fill)
        rect(60, y + 7, 5, row_h - 14, recipe["colour"], 2)
        bottle(77, y + 10, recipe["colour"], .6)
        text(109, y + 30, recipe["name"], 21, INK, 700)
        text(343, y + (21 if special else 30), recipe["ingredient"], 20)
        if special:
            text(343, y + 41, "Start: " + recipe["base"], 16, "#695481")
        text(666, y + 30, recipe["normal"], 21)
        text(816, y + 30, recipe["extended"], 19, INK if recipe["extended"] != "—" else MUTED)
        text(1078, y + 30, recipe["enhanced"], 17 if "J " in recipe["enhanced"] else 20, INK if recipe["enhanced"] != "—" else MUTED)
    bottom = top + 55 + len(DATA["recipes"]) * row_h
    text(60, bottom + 29, "White/green rows start with Awkward Potion. Purple rows use the named starting bottle.", 19, MUTED)

    # Modifier flow and conversion exception are visible, not buried in prose.
    y = 1510
    text(60, y, "03  MODIFY THE FINISHED EFFECT", 23, GREEN, 700)
    rect(60, y + 20, 618, 161, "#f9f3e4", 12)
    text(82, y + 57, "LONGER OR STRONGER", 21, "#835b19", 700)
    text(82, y + 92, "Redstone → longer time (see the table)", 21)
    text(82, y + 123, "Glowstone → higher level (II, or Slowness IV)", 20)
    text(82, y + 157, "Choose one. You cannot combine both upgrades.", 19, MUTED)
    rect(700, y + 20, 640, 161, "#eaf2f7", 12)
    text(722, y + 57, "THROW OR LEAVE A CLOUD", 21, "#316183", 700)
    text(722, y + 92, "Drinkable + gunpowder → Splash", 21)
    text(722, y + 123, "Splash + dragon’s breath → Lingering", 21)
    text(722, y + 157, "Brew the effect, then upgrade, then change its form.", 19, MUTED)

    text(60, 1731, "DON’T MISS THESE DETAILS", 23, GREEN, 700)
    for y, line in [
        (1767, "• Weakness skips nether wart: Water bottle + fermented spider eye."),
        (1799, "• Fermented spider eye = spider eye + sugar + brown mushroom (crafting)."),
        (1831, "• Turtle Master II = Resistance IV + Slowness VI; normal = Resistance III + Slowness IV."),
        (1863, "• Splash/lingering timers differ from this table; check the bottle tooltip and impact distance."),
        (1895, "• Mundane/Thick have no useful Survival branch. Luck/Decay cannot be brewed in Survival."),
    ]:
        text(60, y, line, 20, MUTED)
    rect(60, 1920, 1280, 2, "#dce5df")
    text(60, 1952, "axelgamer.com/minecraft/potion-brewing-chart/", 20, GREEN, 700)
    text(1340, 1952, "1.21+ vanilla • Checked " + DATA["checked"], 17, MUTED, 400, "end")
    PARTS.append('</g></svg>')
    svg = OUT / "minecraft-potion-brewing-chart.svg"
    svg.write_text("\n".join(PARTS) + "\n")
    subprocess.run(["rsvg-convert", "--width", "3508", "--height", "4961", "--output", str(OUT / "minecraft-potion-brewing-chart.png"), str(svg)], check=True)
    subprocess.run(["rsvg-convert", "--format", "pdf", "--output", str(OUT / "minecraft-potion-brewing-chart.pdf"), str(svg)], check=True)
    print("Created A3 SVG, 3508×4961 PNG and vector PDF in", OUT)


if __name__ == "__main__":
    main()
