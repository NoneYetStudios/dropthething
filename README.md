# Drop The Thing ☄️🎹🍉

A complete, humorous, physics-based web toy where users drop random objects from the top of the screen and watch them bounce, splatter, shatter, or explode.

**Target Deployment:** `https://dropthething.stabthefinger.com`

---

## Features

1. **100+ Droppable Objects (`frontend/js/objects.js`)**
   - **108 droppable objects, here's a few:**
     - **Grand Piano** (`piano`) — Weight: `450 lbs` (×2.5), Fragility: `65`, Effects: `SHATTER`, `FLOOR_CRACK`
     - **Watermelon** (`watermelon`) — Weight: `18 lbs` (×1.4), Fragility: `22`, Effect: `SPLATTER`
     - **Bowling Ball** (`bowling_ball`) — Weight: `16 lbs` (×1.75), Fragility: `135`, Effect: `BOUNCE`
     - **Rubber Duck** (`rubber_duck`) — Weight: `0.2 lbs` (×1.1), Fragility: `999`, Effect: `BOUNCE`
     - **Iron Anvil** (`anvil`) — Weight: `250 lbs` (×2.35), Fragility: `110`, Effects: `EXPLODE`, `FLOOR_CRACK`
     - **Quantum Watermelon** (`quantum_watermelon`) — Weight: `18 lbs` (×2.3), Fragility: `24`, Effects: `SPLATTER`, `ANTI_GRAVITY`, `GLITCH`
     - **Massive Safe** (`safe`) — Weight: `800 lbs` (×2.8), Fragility: `70`, Effects: `SHATTER`, `GOLD_BURST`, `FLOOR_CRACK`
     - **Apple II** (`apple_ii`) — Weight: `25 lbs` (×1.85), Fragility: `38`, Effects: `SHATTER`, `GLITCH`
     - **Birthday Cake** (`birthday_cake`) — Weight: `8 lbs` (×1.3), Fragility: `12`, Effects: `SPLATTER`, `CONFETTI`
     - **Lava Lamp** (`lava_lamp`) — Weight: `7 lbs` (×1.55), Fragility: `24`, Effects: `SHATTER`, `SPLATTER`
     - **Garden Gnome** (`garden_gnome`) — Weight: `10 lbs` (×1.6), Fragility: `32`, Effects: `SHATTER`, `FRAGMENT`
     - **Internet Comment Section** (`internet_comments`) — Weight: `999 lbs` (×3.0), Fragility: `5`, Effects: `EXPLODE`, `GLITCH`, `BLACK_HOLE`
     - ...plus vending machines, kayaks, server racks, dial telephones, tiny moons, piñatas, and dozens more!
   - **Exploration-First Catalog:** 12 objects displayed per page with simple Next/Previous paging. Catalog order is dynamically randomized on every page visit.
   - **Random Thing:** A single click selects a surprise object from across the entire 108-object library. No unlock gates, categories, or grinding—everything is immediately playable.

2. **Expanded Physics & Effect System (`frontend/js/physics.js`)**
   - Custom 2D physics engine simulating gravity, drag, angular momentum, wall ricochets, squash-and-stretch, and impact forces.
   - **Breakage Rule:** `if (fragility < impactForce)` → object shatters or splatters into dynamic physical shards.
   - **22 Absurd Effects:** Supports stacked primary and secondary behaviors, including:
     - `SHATTER`, `SPLATTER`, `BOUNCE`, `EXPLODE`
     - `GOLD_BURST`, `DUCK_STORM`, `MULTI_DROP`, `FLOOR_CRACK`, `MEGA_BOUNCE`
     - `CONFETTI`, `SPRING_LAUNCH`, `CHAIN_REACTION`, `SPAWN_OBJECT`, `FRAGMENT`
     - `PORTAL`, `RICOCHET`, `BLACK_HOLE`, `MOON_GRAVITY`, `RAIN_OF_OBJECTS`, `GLITCH`, `DUCKIFIED`
   - **Post-Drop Environmental Modifiers:** Certain drops trigger persistent world effects (e.g. `ANTI_GRAVITY` field) that alter gravity for subsequent drops with progressive decay (40% → 60% → 80% → 100% normal gravity).
   - **Active Effects Panel:** Live readout under the Drop Zone showing active environmental modifiers, remaining drops, and current field strengths.
   - **Mop Floor:** Cleans up all shards, splatters, and floor cracks, and instantly restores broken reality.

3. **Chaos Factor Score System**
   - `Score = Chaos Factor = (Impact Force × Weight Modifier) + Breakage Bonus + Special Effect Bonuses`
   - Displayed in **big goofy numbers** with bouncy animations, humorous micro-taunts, and a full formula breakdown.

4. **Modern Mode + Retro Mode Toggle**
   - **Modern Mode:** Clean UI, bold shapes, smooth animations, soft shadows, and bespoke vector artwork.
   - **Retro Mode:** 16×16 pixel-art silhouettes for all 108 objects, 8-bit chiptune sound effects, and a CRT scanline overlay.

5. **Share Button & Challenge Deep-Links**
   - Generates encoded URLs like `/?object=piano&score=842`.
   - Displays an interactive challenge banner and automatically queues the challenged object.

6. **Nickname System & Top 50 Chaos Leaderboard**
   - Safe, family-friendly nickname filtering (alphanumeric + underscores, with Lemonade Stand style profanity checks).
   - Persistent Top 50 Chaos Leaderboard with both PHP/PDO SQLite and Node.js/SQLite backends.

---

## Quick Start (Local Development)

```bash
# 1. Generate all Modern SVGs, Retro Pixel SVGs, and WAV sound files
npm run build

# 2. Run the automated test suite (verifies physics, chaos scoring, catalog, filter, and APIs)
npm test

# 3. Start the local server (zero external npm dependencies required!)
npm start
```

Then open **`http://localhost:3000`** in your browser!

---

## Deployment to `dropthething.stabthefinger.com`

### Option A: Shared Hosting / cPanel (Apache + PHP) — *Recommended*
1. Point your subdomain `dropthething.stabthefinger.com` to its document root folder.
2. Upload the contents of [`frontend/`](frontend) directly into that document root.
3. All modern/retro SVGs, WAV audio, `.htaccess` rewrite rules, and [`api/index.php`](frontend/api/index.php) are included. The SQLite database is automatically created and seeded in `data/dropthething.db` on first run.

### Option B: VPS / Node.js
1. Clone the repository and install Node.js (v22.5+ for native `node:sqlite`).
2. Run `PORT=3088 npm start` (or manage with PM2).
3. Reverse proxy `dropthething.stabthefinger.com` via Nginx or Caddy to port `3088`.

---

## License

MIT License © 2026 None Yet Studios
