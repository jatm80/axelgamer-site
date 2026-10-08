+++
title = "Chaos Cubed: Java vs Bedrock Differences"
seo_title = "Chaos Cubed: Java vs Bedrock"
description = "Compare Chaos Cubed in Java 26.2 and Bedrock 26.30, including shared features and mechanics documented in detail only for Java."
date = 2026-10-08
lastmod = 2026-10-08
type = "posts"
topics = ["minecraft", "chaos-cubed", "java-edition", "bedrock-edition"]
+++

**The main Chaos Cubed content is in both Java 26.2 and Bedrock 26.30, but Mojang’s Java release notes document several mechanics much more precisely.** Do not treat a detail missing from Bedrock’s shorter changelog as either confirmed parity or proof of a difference; test it in your edition before building around it.

## Explicitly described in both final changelogs

Both sets of final notes describe:

- sulfur caves, springs and Sulfur Cubes;
- cubes absorbing blocks and changing how they move;
- bucket transport for Sulfur Cubes;
- Cinnabar and sulfur building sets;
- Potent Sulfur producing bubbles and nausea-causing gas;
- magma, Potent Sulfur and one to four water blocks forming a geyser;
- TNT and magma as special cube interactions;
- the *Bounce* music disc in mineshaft chest minecarts inside sulfur caves.

These are the safest shared features to discuss without extra qualification.

## Details specified in Java 26.2 only

The final Java notes, but not the shorter Bedrock 26.30 changelog, specify:

- named movement archetypes for wood, stone-like, metal, organic, wool, ice, shroom and other block groups;
- Slime Balls growing a small cube and large-only bucket collection;
- shears and dispensers inserting, swapping or removing absorbed blocks;
- minecart transport and the restriction on boats;
- exact TNT fuse times and restrictions after the TNT is primed;
- lava creating a continuous geyser;
- geyser start and end events being detectable by Sculk Sensors.

Some or all may also work in Bedrock, but the final Bedrock changelog does not establish that. If you test one, record the exact Bedrock version and setup rather than assuming the Java description applies.

## Edition features released alongside the drop

Java 26.2 also introduced a Java Friends List and experimental Vulkan rendering support. During the same season, Mojang promoted the Bedrock Parties beta. Those are edition-level social or technical features, not different Sulfur Cube mechanics.

## What this means for builds

Simple exploring and decorative projects should start from the shared list above. For redstone launchers, timed TNT games or automatic dispensers, prototype in the edition where the finished build will run. Java and Bedrock already have engine and redstone differences outside Chaos Cubed, so a design copied block-for-block may need adjustment.

Use [what Sulfur Cubes eat](/minecraft/chaos-cubed/what-sulfur-cubes-eat/) for Java’s documented block groups and [how Minecraft geysers work](/minecraft/chaos-cubed/how-minecraft-geysers-work/) for the shared magma recipe. Return to the [Chaos Cubed hub](/minecraft/chaos-cubed/) or main [Minecraft hub](/minecraft/).

Axel discussed the early reveal in [Minecraft LIVE May 2026: Chaos Cubed and Sulfur Cubes](/posts/minecraft-live-may-2026-chaos-cubed-sulfur-cubes/). For another AxelGamer Minecraft watch, see his [secret storage base video](/videos/minecraft-secret-storage-base/).

## Sources and testing note

This comparison uses Mojang’s final [Java 26.2 release notes](https://www.minecraft.net/en-us/article/minecraft-java-edition-26-2) and [Bedrock 26.30 changelog](https://www.minecraft.net/en-us/article/minecraft-26-30-bedrock-changelog). We have not independently tested every behaviour on both editions, so the page distinguishes documented differences from genuine gameplay differences.
