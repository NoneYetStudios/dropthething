# Drop The Thing ☄️🎹🍉

A complete, humorous, physics-based web toy where users drop random objects from the top of the screen and watch them bounce, splatter, shatter, or explode.

**Target Deployment:** `https://dropthething.stabthefinger.com`

---

## Features

1. **12 Droppable Objects (`frontend/js/objects.js`)**
   - **Grand Piano** (`piano`) — Weight: `450 lbs` (×2.5), Fragility: `65`, Effect: `shatter`
   - **Watermelon** (`watermelon`) — Weight: `18 lbs` (×1.4), Fragility: `22`, Effect: `splatter`
   - **Bowling Ball** (`bowling_ball`) — Weight: `16 lbs` (×1.75), Fragility: `135`, Effect: `bounce`
   - **Rubber Duck** (`rubber_duck`) — Weight: `0.2 lbs` (×1.1), Fragility: `999`, Effect: `bounce`
   - **Iron Anvil** (`anvil`) — Weight: `250 lbs` (×2.35), Fragility: `110`, Effect: `explode`
   - **Glass Bottle** (`glass_bottle`) — Weight: `1.2 lbs` (×1.25), Fragility: `15`, Effect: `shatter`
   - **Pumpkin** (`pumpkin`) — Weight: `14 lbs` (×1.45), Fragility: `25`, Effect: `splatter`
   - **CRT Television** (`tv`) — Weight: `65 lbs` (×1.95), Fragility: `42`, Effect: `explode`
   - **Chrome Toaster** (`toaster`) — Weight: `6 lbs` (×1.5), Fragility: `35`, Effect: `explode`
   - **Red Brick** (`brick`) — Weight: `5 lbs` (×1.55), Fragility: `48`, Effect: `shatter`
   - **Giant Egg** (`giant_egg`) — Weight: `42 lbs` (×1.85), Fragility: `18`, Effect: `splatter`
   - **Mystery Box** (`mystery_box`) — Weight: `50 lbs` (×2.15), Fragility: `28`, Effect: `explode`

2. **Custom 2D Physics Engine (`frontend/js/physics.js`)**
   - Spawns objects at top center of the tall vertical Drop Zone
   - Simulates gravity, air drag, angular rotation, wall ricochets, squash-and-stretch, and impact force
   - **Breakage Rule:** `if (fragility < impactForce)` → object breaks into spinning physical shards
   - **Special Effects:**
     - `splatter`: spawns persistent juicy floor/wall splatter decals & flying droplets
     - `explode`: spawns expanding shockwave rings, high-velocity particle burst, crater & screen shake
     - `shatter`: spawns spinning rigid-body shards (piano keys, glass fragments, toast slices, masonry chunks)
     - `bounce`: exaggerated cartoon bounce with squash-and-stretch and comic `"BOING!"` / `"SQUEAK!"` popups

3. **Chaos Factor Score System**
   - `Score = Chaos Factor = (Impact Force × Weight Modifier) + Breakage Bonus + Special Effect Bonus`
   - Displayed in **big goofy numbers** with animated pop/wobble and full formula breakdown

4. **Modern Mode + Retro Mode Toggle**
   - **Modern Mode:** Clean UI, bright colors, bold shapes, smooth animations, soft shadows, vector SVGs
   - **Retro Mode:** 16×16 Pixel-art sprites for all 12 objects, 8-bit chiptune synthesized sound effects, CRT scanline overlay

5. **Share Button & Challenge Deep-Links**
   - Generates encoded URLs like `/drop?object=piano&score=842`
   - Visiting a shared URL displays an interactive challenge banner and pre-selects the object

6. **Nickname System & Top 50 Chaos Leaderboard**
   - Uses the exact same family-friendly filtering rules as Lemonade Stand (`ProfanityFilter.validateNickname`)
   - Stores the Top 50 Chaos Scores with object used + nickname in SQLite

---

## Quick Start

```bash
# 1. Generate all Modern SVGs, Retro Pixel SVGs, and WAV sound files
npm run build

# 2. Run the automated verification test suite
npm test

# 3. Start the server (zero external npm dependencies!)
npm start
```

Then open **`http://localhost:3000/drop`** in your browser!
