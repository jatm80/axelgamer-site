+++
title = "What Do Sulfur Cubes Eat in Minecraft?"
seo_title = "What Do Sulfur Cubes Eat in Minecraft?"
description = "Sulfur Cubes absorb many blocks, and each block group changes their movement. See confirmed block effects plus TNT and magma warnings."
date = 2026-10-08
lastmod = 2026-10-08
type = "posts"
topics = ["minecraft", "chaos-cubed", "sulfur-cube", "sulfur-cube-food", "family-gaming"]
+++

**Sulfur Cubes “eat” many placeable blocks rather than normal animal food.** Interact with a cube while holding a compatible block, or drop a compatible block item nearby. The cube absorbs it, stops its normal AI and behaves like a pushable physical object whose speed, bounce and friction depend on the block group.

## Confirmed block groups and effects

Java 26.2 groups absorbed blocks into these named movement archetypes. Bedrock 26.30 confirms that absorbed blocks alter movement, but its final changelog does not list the exact groups:

- **Loose mineral and soil blocks:** medium speed and bounce; the cube floats.
- **Wooden blocks:** fast and highly bouncy; it also floats.
- **Stone-like blocks:** slow but highly bouncy.
- **Metal blocks:** slow, flat movement with low bounce.
- **Organic blocks:** fast, flat movement.
- **Wool blocks:** light, slow and highly bouncy, with strong air drag; it floats.
- **Icy blocks:** fast and sliding, with no bounce and little ground friction.
- **Shroom blocks:** slow and sliding.
- **Soul sand or soul soil:** very slow, with low bounce, low drag and high friction.
- **Honeycomb blocks:** fast-flat movement with no bounce and extremely high ground friction.
- **TNT:** explosive behaviour after ignition.
- **Magma blocks:** a hot cube that damages entities touching it.

The exact accepted items are data-driven, so it is better to test a block than assume every decorative variant belongs to the same group.

## How to remove or swap a block

Use shears on an unprimed cube to remove its absorbed block and restore its AI. You can then try another block. A dispenser can also insert or swap blocks and can use shears on a cube, which is handy for controlled experiments.

Do not try to shear out primed TNT. Once the TNT inside has been lit, it cannot be removed, and the cube cannot be collected in a bucket.

## Does a Sulfur Cube eat Slime Balls?

In Java 26.2, a small Sulfur Cube can consume Slime Balls to grow into a large cube. This is different from absorbing a block for movement. Growing it matters because only a large cube can be picked up with an empty bucket.

For a safe comparison, build a straight test lane and try wood, stone, metal, wool and ice one at a time. Our [useful Sulfur Cube experiments](/minecraft/chaos-cubed/useful-sulfur-cube-experiments/) guide has a family-friendly test plan. Also read [TNT and Sulfur Cube interactions](/minecraft/chaos-cubed/tnt-sulfur-cube-interactions/) before using explosives.

Return to the [Chaos Cubed guide hub](/minecraft/chaos-cubed/) or browse [Minecraft guides](/minecraft/). Axel’s [Chaos Cubed reveal recap](/posts/minecraft-live-may-2026-chaos-cubed-sulfur-cubes/) shows why the block-eating mob became the star of the update. You can also watch his [Minecraft secret storage base video](/videos/minecraft-secret-storage-base/).

*Mechanics checked against Mojang’s final Java 26.2 release notes and Bedrock 26.30 changelog.*
