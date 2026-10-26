/**
 * Drop The Thing — Expansion Pass Catalog (108 Absurd Droppable Objects)
 * Supports:
 * - primaryEffect + secondaryEffects array architecture (22 distinct effects)
 * - 108 total objects across Heavy, Food, Retro, Weird, Office, Ridiculous, Legendary, and Classic items
 * - Modern SVG vector art + 16x16 Retro Pixel-Art SVG for all 108 objects
 * - Large contextual micro-taunt library
 * - Shared by Browser (window.DropObjects) and Node.js (CommonJS)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DropObjects = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * All 22 Supported Effects & their Chaos Bonus values + badge styling
   */
  const EFFECTS = {
    SHATTER:          { id: 'SHATTER',          label: 'Shatter',          bonus: 150, color: '#38bdf8' },
    SPLATTER:         { id: 'SPLATTER',         label: 'Splatter',         bonus: 145, color: '#fb7185' },
    BOUNCE:           { id: 'BOUNCE',           label: 'Bounce',           bonus: 140, color: '#facc15' },
    EXPLODE:          { id: 'EXPLODE',          label: 'Explode',          bonus: 185, color: '#f97316' },
    GOLD_BURST:       { id: 'GOLD_BURST',       label: 'Gold Burst',       bonus: 260, color: '#eab308' },
    DUCK_STORM:       { id: 'DUCK_STORM',       label: 'Duck Storm',       bonus: 280, color: '#fde047' },
    MULTI_DROP:       { id: 'MULTI_DROP',       label: 'Multi Drop',       bonus: 210, color: '#a855f7' },
    FLOOR_CRACK:      { id: 'FLOOR_CRACK',      label: 'Floor Crack',      bonus: 175, color: '#64748b' },
    MEGA_BOUNCE:      { id: 'MEGA_BOUNCE',      label: 'Mega Bounce',      bonus: 225, color: '#4ade80' },
    ANTI_GRAVITY:     { id: 'ANTI_GRAVITY',     label: 'Anti-Gravity',     bonus: 240, color: '#2dd4bf' },
    CONFETTI:         { id: 'CONFETTI',         label: 'Confetti',         bonus: 165, color: '#ec4899' },
    SPRING_LAUNCH:    { id: 'SPRING_LAUNCH',    label: 'Spring Launch',    bonus: 215, color: '#fb923c' },
    CHAIN_REACTION:   { id: 'CHAIN_REACTION',   label: 'Chain Reaction',   bonus: 295, color: '#ef4444' },
    SPAWN_OBJECT:     { id: 'SPAWN_OBJECT',     label: 'Spawn Object',     bonus: 230, color: '#c084fc' },
    FRAGMENT:         { id: 'FRAGMENT',         label: 'Fragment',         bonus: 205, color: '#94a3b8' },
    PORTAL:           { id: 'PORTAL',           label: 'Portal',           bonus: 310, color: '#818cf8' },
    RICOCHET:         { id: 'RICOCHET',         label: 'Ricochet',         bonus: 195, color: '#fcd34d' },
    BLACK_HOLE:       { id: 'BLACK_HOLE',       label: 'Black Hole',       bonus: 350, color: '#6366f1' },
    MOON_GRAVITY:     { id: 'MOON_GRAVITY',     label: 'Moon Gravity',     bonus: 190, color: '#cbd5e1' },
    RAIN_OF_OBJECTS:  { id: 'RAIN_OF_OBJECTS',  label: 'Rain of Objects',  bonus: 320, color: '#34d399' },
    GLITCH:           { id: 'GLITCH',           label: 'Glitch',           bonus: 330, color: '#22d3ee' },
    DUCKIFIED:        { id: 'DUCKIFIED',        label: 'Duckified',        bonus: 340, color: '#facc15' }
  };

  /**
   * Generate bespoke Modern SVG and 16x16 Retro Pixel-Art SVG for all 108 objects
   * so every item in the catalog has an unmistakable, recognizable silhouette.
   */
  function buildVisualArtwork(spec) {
    const id = spec.id;
    const c1 = spec.primaryColor || '#3b82f6';
    const c2 = spec.secondaryColor || '#facc15';
    const c3 = spec.accentColor || '#ef4444';
    const shape = spec.shape || 'box';
    const label = (spec.badgeText || '').slice(0, 6);

    let modernInner = '';
    let retroInner = '';
    let suppressBadge = true; // Only show badge text when explicitly helpful

    switch (id) {
      // === KAYAK (Sleek double-pointed kayak hull, cockpit rim, seat, bungee rigging & double-bladed paddle) ===
      case 'kayak':
        modernInner = `
          <g transform="rotate(-28 48 48)">
            <path d="M48 6 C63 22 65 74 48 90 C31 74 33 22 48 6 Z" fill="${c1}" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M48 10 C57 24 58 72 48 86 C38 72 39 24 48 10 Z" fill="#facc15" opacity="0.5"/>
            <line x1="41" y1="22" x2="55" y2="26" stroke="#0f172a" stroke-width="2"/>
            <line x1="55" y1="22" x2="41" y2="26" stroke="#0f172a" stroke-width="2"/>
            <line x1="41" y1="70" x2="55" y2="74" stroke="#0f172a" stroke-width="2"/>
            <ellipse cx="48" cy="48" rx="9.5" ry="15" fill="#0f172a" stroke="#334155" stroke-width="2.5"/>
            <ellipse cx="48" cy="50" rx="6.5" ry="9" fill="#1e293b"/>
            <line x1="12" y1="48" x2="84" y2="48" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
            <rect x="6" y="43" width="14" height="10" rx="3" fill="${c2}" stroke="#0f172a" stroke-width="2.5"/>
            <rect x="76" y="43" width="14" height="10" rx="3" fill="${c2}" stroke="#0f172a" stroke-width="2.5"/>
          </g>
        `;
        retroInner = `
          <rect x="7" y="1" width="2" height="14" fill="${c1}"/>
          <rect x="6" y="2" width="4" height="12" fill="${c1}"/>
          <rect x="5" y="4" width="6" height="8" fill="${c1}"/>
          <rect x="6" y="6" width="4" height="4" fill="#0f172a"/>
          <rect x="1" y="7" width="14" height="2" fill="#475569"/>
          <rect x="1" y="6" width="3" height="4" fill="${c2}"/>
          <rect x="12" y="6" width="3" height="4" fill="${c2}"/>
        `;
        break;

      // === DIAL TELEPHONE (Classic rotary bell base, 10-hole rotary finger wheel, cradle prongs & curved handset) ===
      case 'dial_telephone':
        modernInner = `
          <path d="M26 30 L20 22 M70 30 L76 22" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
          <path d="M14 22 C14 12 34 12 34 22 L62 22 C62 12 82 12 82 22 C82 28 68 28 64 24 L32 24 C28 28 14 28 14 22 Z" fill="${c1}" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="14" y="20" width="16" height="9" rx="4" fill="#991b1b" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="66" y="20" width="16" height="9" rx="4" fill="#991b1b" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M26 34 L70 34 L80 74 C81 78 78 80 73 80 L23 80 C18 80 15 78 16 74 Z" fill="${c1}" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <circle cx="48" cy="57" r="16.5" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
          <circle cx="48" cy="57" r="5.5" fill="${c1}" stroke="#0f172a" stroke-width="2"/>
          <circle cx="48" cy="45" r="2.2" fill="#0f172a"/>
          <circle cx="56" cy="47" r="2.2" fill="#0f172a"/>
          <circle cx="60" cy="55" r="2.2" fill="#0f172a"/>
          <circle cx="57" cy="63" r="2.2" fill="#0f172a"/>
          <circle cx="50" cy="68" r="2.2" fill="#0f172a"/>
          <circle cx="41" cy="66" r="2.2" fill="#0f172a"/>
          <circle cx="37" cy="59" r="2.2" fill="#0f172a"/>
          <circle cx="38" cy="50" r="2.2" fill="#0f172a"/>
          <line x1="55" y1="62" x2="64" y2="69" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="2" y="2" width="3" height="3" fill="${c1}"/>
          <rect x="11" y="2" width="3" height="3" fill="${c1}"/>
          <rect x="4" y="2" width="8" height="2" fill="${c1}"/>
          <rect x="5" y="4" width="1" height="2" fill="#cbd5e1"/>
          <rect x="10" y="4" width="1" height="2" fill="#cbd5e1"/>
          <rect x="4" y="6" width="8" height="3" fill="${c1}"/>
          <rect x="2" y="9" width="12" height="5" fill="${c1}"/>
          <rect x="5" y="7" width="6" height="6" fill="#ffffff"/>
          <rect x="7" y="9" width="2" height="2" fill="${c1}"/>
          <rect x="6" y="7" width="1" height="1" fill="#0f172a"/>
          <rect x="9" y="7" width="1" height="1" fill="#0f172a"/>
          <rect x="10" y="10" width="1" height="1" fill="#0f172a"/>
          <rect x="6" y="11" width="1" height="1" fill="#0f172a"/>
        `;
        break;

      // === ORIGINAL 12 BESPOKE SILHOUETTES ===
      case 'piano':
        modernInner = `
          <path d="M18 22 H56 C72 22 78 34 78 48 V64 H18 Z" fill="#1e293b" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M20 20 L66 10 L68 14 L22 23 Z" fill="#334155" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="60" y1="22" x2="63" y2="12" stroke="#f59e0b" stroke-width="2.5"/>
          <rect x="16" y="50" width="64" height="14" rx="2" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
          <rect x="23" y="50" width="4" height="8" fill="#0f172a"/>
          <rect x="30" y="50" width="4" height="8" fill="#0f172a"/>
          <rect x="41" y="50" width="4" height="8" fill="#0f172a"/>
          <rect x="48" y="50" width="4" height="8" fill="#0f172a"/>
          <rect x="55" y="50" width="4" height="8" fill="#0f172a"/>
          <rect x="66" y="50" width="4" height="8" fill="#0f172a"/>
          <rect x="22" y="64" width="6" height="18" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="68" y="64" width="6" height="18" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="44" y="64" width="8" height="15" fill="#f59e0b" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="3" y="2" width="9" height="8" fill="#1e293b"/>
          <rect x="10" y="4" width="4" height="6" fill="#1e293b"/>
          <rect x="2" y="9" width="12" height="3" fill="#f8fafc"/>
          <rect x="4" y="9" width="1" height="2" fill="#0f172a"/>
          <rect x="6" y="9" width="1" height="2" fill="#0f172a"/>
          <rect x="9" y="9" width="1" height="2" fill="#0f172a"/>
          <rect x="11" y="9" width="1" height="2" fill="#0f172a"/>
          <rect x="3" y="12" width="2" height="3" fill="#1e293b"/>
          <rect x="11" y="12" width="2" height="3" fill="#1e293b"/>
          <rect x="7" y="12" width="2" height="3" fill="#f59e0b"/>
        `;
        break;

      case 'watermelon':
        modernInner = `
          <circle cx="48" cy="48" r="31" fill="#16a34a" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M32 20 Q40 48 32 76 M48 17 Q55 48 48 79 M64 20 Q56 48 64 76" stroke="#14532d" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M24 52 A24 24 0 0 0 72 52 Z" fill="#ef4444" stroke="#bbf7d0" stroke-width="3"/>
          <circle cx="38" cy="60" r="2.2" fill="#0f172a"/>
          <circle cx="48" cy="64" r="2.2" fill="#0f172a"/>
          <circle cx="58" cy="60" r="2.2" fill="#0f172a"/>
        `;
        retroInner = `
          <rect x="4" y="2" width="8" height="12" fill="#16a34a"/>
          <rect x="2" y="4" width="12" height="8" fill="#16a34a"/>
          <rect x="4" y="8" width="8" height="4" fill="#ef4444"/>
          <rect x="5" y="9" width="1" height="1" fill="#0f172a"/>
          <rect x="8" y="10" width="1" height="1" fill="#0f172a"/>
          <rect x="10" y="9" width="1" height="1" fill="#0f172a"/>
        `;
        break;

      case 'bowling_ball':
        modernInner = `
          <circle cx="48" cy="48" r="31" fill="#1e1b4b" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="42" cy="34" r="4.2" fill="#0f172a" stroke="#6366f1" stroke-width="1.5"/>
          <circle cx="54" cy="36" r="4.2" fill="#0f172a" stroke="#6366f1" stroke-width="1.5"/>
          <circle cx="47" cy="46" r="4.6" fill="#0f172a" stroke="#6366f1" stroke-width="1.5"/>
          <ellipse cx="32" cy="30" rx="7" ry="4" transform="rotate(-30 32 30)" fill="rgba(255,255,255,0.35)"/>
        `;
        retroInner = `
          <rect x="4" y="2" width="8" height="12" fill="#1e1b4b"/>
          <rect x="2" y="4" width="12" height="8" fill="#1e1b4b"/>
          <rect x="6" y="4" width="2" height="2" fill="#0f172a"/>
          <rect x="9" y="4" width="2" height="2" fill="#0f172a"/>
          <rect x="7" y="7" width="2" height="2" fill="#0f172a"/>
          <rect x="4" y="4" width="1" height="2" fill="#818cf8"/>
        `;
        break;

      case 'anvil':
        modernInner = `
          <path d="M10 38 L30 30 H78 L86 42 L72 48 H60 L58 64 L72 74 H24 L36 64 L34 48 H26 Z" fill="#475569" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="30" y="30" width="46" height="6" fill="#94a3b8"/>
        `;
        retroInner = `
          <rect x="1" y="5" width="4" height="3" fill="#64748b"/>
          <rect x="5" y="4" width="9" height="4" fill="#475569"/>
          <rect x="6" y="8" width="4" height="3" fill="#334155"/>
          <rect x="3" y="11" width="10" height="3" fill="#475569"/>
        `;
        break;

      case 'glass_bottle':
        modernInner = `
          <rect x="43" y="10" width="10" height="6" rx="2" fill="#d97706" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M42 16 H54 L56 34 L66 44 V76 C66 79 63 81 59 81 H37 C33 81 30 79 30 76 V44 L40 34 Z" fill="#10b981" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="34" y="50" width="28" height="18" rx="2" fill="#fef3c7" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="36" y1="42" x2="36" y2="74" stroke="rgba(255,255,255,0.55)" stroke-width="3" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="7" y="1" width="2" height="2" fill="#d97706"/>
          <rect x="6" y="3" width="4" height="3" fill="#10b981"/>
          <rect x="4" y="6" width="8" height="9" fill="#10b981"/>
          <rect x="5" y="8" width="6" height="4" fill="#fef3c7"/>
        `;
        break;

      case 'pumpkin':
        modernInner = `
          <path d="M45 14 C45 8 54 8 56 14 L52 24 H44 Z" fill="#15803d" stroke="#0f172a" stroke-width="3"/>
          <ellipse cx="32" cy="52" rx="16" ry="26" fill="#ea580c" stroke="#0f172a" stroke-width="3.5"/>
          <ellipse cx="64" cy="52" rx="16" ry="26" fill="#ea580c" stroke="#0f172a" stroke-width="3.5"/>
          <ellipse cx="48" cy="52" rx="18" ry="28" fill="#f97316" stroke="#0f172a" stroke-width="3.5"/>
        `;
        retroInner = `
          <rect x="7" y="1" width="2" height="3" fill="#15803d"/>
          <rect x="2" y="4" width="12" height="10" fill="#ea580c"/>
          <rect x="5" y="4" width="6" height="10" fill="#f97316"/>
        `;
        break;

      case 'tv':
        modernInner = `
          <line x1="36" y1="6" x2="46" y2="20" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
          <line x1="62" y1="6" x2="50" y2="20" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
          <rect x="16" y="20" width="64" height="54" rx="7" fill="#78350f" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="22" y="26" width="42" height="38" rx="5" fill="#0ea5e9" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="71" cy="35" r="4" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
          <circle cx="71" cy="48" r="4" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="4" y="1" width="1" height="2" fill="#94a3b8"/>
          <rect x="11" y="1" width="1" height="2" fill="#94a3b8"/>
          <rect x="2" y="3" width="12" height="11" fill="#78350f"/>
          <rect x="3" y="4" width="8" height="8" fill="#0ea5e9"/>
          <rect x="12" y="5" width="1" height="2" fill="#facc15"/>
        `;
        break;

      case 'toaster':
      case 'cursed_toaster': {
        const isCursed = id === 'cursed_toaster';
        modernInner = `
          <rect x="28" y="14" width="16" height="18" rx="4" fill="${isCursed ? '#a855f7' : '#d97706'}" stroke="#0f172a" stroke-width="3"/>
          <rect x="50" y="12" width="16" height="18" rx="4" fill="${isCursed ? '#ec4899' : '#f59e0b'}" stroke="#0f172a" stroke-width="3"/>
          <path d="M18 32 C18 26 24 24 30 24 H66 C72 24 78 26 78 32 V72 H18 Z" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="78" y="42" width="8" height="5" rx="2" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
          <circle cx="34" cy="54" r="5" fill="${c3}" stroke="#0f172a" stroke-width="2"/>
          ${isCursed ? '<circle cx="58" cy="54" r="5" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>' : ''}
        `;
        retroInner = `
          <rect x="4" y="2" width="3" height="3" fill="${isCursed ? '#a855f7' : '#d97706'}"/>
          <rect x="9" y="1" width="3" height="4" fill="${isCursed ? '#ec4899' : '#f59e0b'}"/>
          <rect x="2" y="5" width="11" height="9" fill="${c1}"/>
          <rect x="13" y="7" width="2" height="2" fill="#ef4444"/>
        `;
        break;
      }

      case 'brick':
        modernInner = `
          <polygon points="14,42 32,26 82,26 64,42" fill="#ef4444" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="14" y="42" width="50" height="26" fill="#dc2626" stroke="#0f172a" stroke-width="3.5"/>
          <polygon points="64,42 82,26 82,52 64,68" fill="#991b1b" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <ellipse cx="34" cy="34" rx="4.5" ry="2.5" fill="#7f1d1d"/>
          <ellipse cx="48" cy="34" rx="4.5" ry="2.5" fill="#7f1d1d"/>
          <ellipse cx="62" cy="34" rx="4.5" ry="2.5" fill="#7f1d1d"/>
        `;
        retroInner = `
          <rect x="2" y="5" width="12" height="7" fill="#dc2626"/>
          <rect x="3" y="4" width="11" height="2" fill="#ef4444"/>
          <rect x="4" y="6" width="2" height="2" fill="#7f1d1d"/>
          <rect x="7" y="6" width="2" height="2" fill="#7f1d1d"/>
          <rect x="10" y="6" width="2" height="2" fill="#7f1d1d"/>
        `;
        break;

      case 'giant_egg':
        modernInner = `
          <path d="M48 12 C66 12 74 38 74 56 C74 72 62 82 48 82 C34 82 22 72 22 56 C22 38 30 12 48 12 Z" fill="#fef3c7" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="38" cy="36" r="4" fill="#f59e0b" opacity="0.65"/>
          <circle cx="56" cy="48" r="5" fill="#f59e0b" opacity="0.65"/>
          <circle cx="40" cy="64" r="3.5" fill="#f59e0b" opacity="0.65"/>
        `;
        retroInner = `
          <rect x="6" y="1" width="4" height="2" fill="#fef3c7"/>
          <rect x="4" y="3" width="8" height="4" fill="#fef3c7"/>
          <rect x="3" y="7" width="10" height="6" fill="#fef3c7"/>
          <rect x="5" y="13" width="6" height="2" fill="#fef3c7"/>
          <rect x="6" y="5" width="2" height="2" fill="#f59e0b"/>
          <rect x="9" y="9" width="2" height="2" fill="#f59e0b"/>
        `;
        break;

      case 'mystery_box':
        modernInner = `
          <rect x="18" y="24" width="60" height="54" rx="6" fill="#9333ea" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="42" y="24" width="12" height="54" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="18" y="45" width="60" height="12" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M48 24 C34 10 26 22 44 24 M48 24 C62 10 70 22 52 24" stroke="#ec4899" stroke-width="4" fill="none"/>
          <text x="48" y="59" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="24" fill="#ffffff" stroke="#0f172a" stroke-width="3" paint-order="stroke">?</text>
        `;
        retroInner = `
          <rect x="2" y="3" width="12" height="11" fill="#9333ea"/>
          <rect x="7" y="3" width="2" height="11" fill="#facc15"/>
          <rect x="2" y="8" width="12" height="2" fill="#facc15"/>
          <rect x="5" y="1" width="6" height="2" fill="#ec4899"/>
        `;
        break;

      // === BESPOKE SILHOUETTES FOR EXPANSION OBJECTS ===
      case 'safe':
      case 'gun_safe':
        modernInner = `
          <rect x="18" y="${id === 'gun_safe' ? 12 : 18}" width="60" height="${id === 'gun_safe' ? 68 : 60}" rx="6" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="25" y="${id === 'gun_safe' ? 19 : 25}" width="46" height="${id === 'gun_safe' ? 54 : 46}" rx="3" fill="#475569" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="68" y="28" width="5" height="8" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <rect x="68" y="56" width="5" height="8" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <circle cx="44" cy="48" r="11" fill="#eab308" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="44" cy="48" r="4" fill="#0f172a"/>
          <line x1="44" y1="35" x2="44" y2="61" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="31" y1="48" x2="57" y2="48" stroke="#0f172a" stroke-width="2.5"/>
        `;
        retroInner = `
          <rect x="2" y="2" width="12" height="12" fill="${c1}"/>
          <rect x="4" y="4" width="8" height="8" fill="#475569"/>
          <rect x="6" y="6" width="4" height="4" fill="#eab308"/>
        `;
        break;

      case 'bathtub':
        modernInner = `
          <path d="M18 38 V24 C18 18 26 18 26 24" stroke="#94a3b8" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="34" cy="34" r="6" fill="#7dd3fc"/>
          <circle cx="46" cy="32" r="7" fill="#bae6fd"/>
          <circle cx="64" cy="33" r="6" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
          <path d="M12 38 H84 L78 66 C76 72 70 75 62 75 H34 C26 75 20 72 18 66 Z" fill="#ffffff" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="10" y="35" width="76" height="6" rx="3" fill="#e2e8f0" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="28" cy="78" r="4" fill="#eab308" stroke="#0f172a" stroke-width="2"/>
          <circle cx="68" cy="78" r="4" fill="#eab308" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="2" y="3" width="2" height="3" fill="#94a3b8"/>
          <rect x="10" y="4" width="2" height="2" fill="#facc15"/>
          <rect x="1" y="6" width="14" height="6" fill="#ffffff"/>
          <rect x="3" y="12" width="2" height="2" fill="#eab308"/>
          <rect x="11" y="12" width="2" height="2" fill="#eab308"/>
        `;
        break;

      case 'cement_mixer':
        modernInner = `
          <g transform="rotate(-22 48 44)">
            <ellipse cx="48" cy="42" rx="24" ry="19" fill="#f59e0b" stroke="#0f172a" stroke-width="3.5"/>
            <rect x="40" y="23" width="8" height="38" fill="#0f172a" opacity="0.25"/>
            <ellipse cx="68" cy="42" rx="5" ry="12" fill="#334155" stroke="#0f172a" stroke-width="2.5"/>
          </g>
          <path d="M24 72 L48 46 L72 72 H24 Z" fill="none" stroke="#475569" stroke-width="4" stroke-linejoin="round"/>
          <circle cx="28" cy="74" r="8" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="68" cy="74" r="8" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
        `;
        retroInner = `
          <rect x="4" y="3" width="8" height="7" fill="#f59e0b"/>
          <rect x="3" y="10" width="10" height="2" fill="#475569"/>
          <rect x="3" y="12" width="3" height="3" fill="#1e293b"/>
          <rect x="10" y="12" width="3" height="3" fill="#1e293b"/>
        `;
        break;

      case 'arcade_cabinet':
        modernInner = `
          <path d="M26 12 H70 L74 24 L66 48 L72 54 V82 H24 V54 L30 48 L22 24 Z" fill="#4f46e5" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="28" y="15" width="40" height="9" rx="2" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
          <rect x="32" y="27" width="32" height="20" rx="3" fill="#0ea5e9" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="38" y1="53" x2="38" y2="46" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
          <circle cx="38" cy="45" r="3" fill="#ef4444"/>
          <circle cx="54" cy="51" r="2.5" fill="#facc15"/>
          <circle cx="60" cy="51" r="2.5" fill="#ec4899"/>
          <rect x="38" y="62" width="20" height="16" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="4" y="1" width="8" height="2" fill="#facc15"/>
          <rect x="4" y="3" width="8" height="12" fill="#4f46e5"/>
          <rect x="5" y="4" width="6" height="4" fill="#0ea5e9"/>
          <rect x="5" y="8" width="1" height="2" fill="#ef4444"/>
          <rect x="9" y="9" width="2" height="1" fill="#facc15"/>
        `;
        break;

      case 'industrial_fan':
        modernInner = `
          <circle cx="48" cy="46" r="30" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
          <ellipse cx="48" cy="28" rx="7" ry="14" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <ellipse cx="48" cy="64" rx="7" ry="14" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <ellipse cx="30" cy="46" rx="14" ry="7" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <ellipse cx="66" cy="46" rx="14" ry="7" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <circle cx="48" cy="46" r="7" fill="#0ea5e9" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="32" y="76" width="32" height="6" rx="2" fill="#475569" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="3" y="2" width="10" height="10" fill="#334155"/>
          <rect x="7" y="3" width="2" height="8" fill="#cbd5e1"/>
          <rect x="4" y="6" width="8" height="2" fill="#cbd5e1"/>
          <rect x="7" y="6" width="2" height="2" fill="#0ea5e9"/>
          <rect x="5" y="13" width="6" height="2" fill="#64748b"/>
        `;
        break;

      case 'giant_donut':
        modernInner = `
          <circle cx="48" cy="48" r="31" fill="#f59e0b" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="48" cy="48" r="24" fill="#ec4899" stroke="#be185d" stroke-width="2"/>
          <circle cx="48" cy="48" r="11" fill="#e0f2fe" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="34" y="28" width="6" height="3" rx="1.5" fill="#fde047" transform="rotate(-20 34 28)"/>
          <rect x="56" y="30" width="6" height="3" rx="1.5" fill="#38bdf8" transform="rotate(25 56 30)"/>
          <rect x="30" y="54" width="6" height="3" rx="1.5" fill="#4ade80" transform="rotate(15 30 54)"/>
          <rect x="58" y="58" width="6" height="3" rx="1.5" fill="#ffffff" transform="rotate(-30 58 58)"/>
        `;
        retroInner = `
          <rect x="3" y="3" width="10" height="10" fill="#f59e0b"/>
          <rect x="4" y="4" width="8" height="8" fill="#ec4899"/>
          <rect x="6" y="6" width="4" height="4" fill="#0f172a"/>
          <rect x="5" y="4" width="1" height="1" fill="#fde047"/>
          <rect x="10" y="9" width="1" height="1" fill="#38bdf8"/>
        `;
        break;

      case 'pickle_jar':
        modernInner = `
          <rect x="32" y="12" width="32" height="8" rx="2" fill="#eab308" stroke="#0f172a" stroke-width="3"/>
          <rect x="26" y="20" width="44" height="60" rx="8" fill="#bef264" fill-opacity="0.75" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="34" y="30" width="10" height="26" rx="5" transform="rotate(-12 39 43)" fill="#15803d" stroke="#0f172a" stroke-width="2"/>
          <rect x="48" y="34" width="10" height="28" rx="5" transform="rotate(10 53 48)" fill="#16a34a" stroke="#0f172a" stroke-width="2"/>
          <rect x="38" y="52" width="10" height="22" rx="5" transform="rotate(28 43 63)" fill="#15803d" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="5" y="1" width="6" height="2" fill="#eab308"/>
          <rect x="4" y="3" width="8" height="12" fill="#bef264"/>
          <rect x="5" y="5" width="2" height="6" fill="#15803d"/>
          <rect x="9" y="6" width="2" height="6" fill="#16a34a"/>
        `;
        break;

      case 'pizza_stack':
        modernInner = `
          <rect x="14" y="56" width="68" height="14" rx="2" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
          <rect x="16" y="42" width="64" height="14" rx="2" fill="#fef3c7" stroke="#0f172a" stroke-width="3"/>
          <rect x="18" y="28" width="60" height="14" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
          <polygon points="48,12 34,28 62,28" fill="#facc15" stroke="#dc2626" stroke-width="2.5"/>
          <circle cx="48" cy="22" r="2.5" fill="#dc2626"/>
        `;
        retroInner = `
          <rect x="2" y="10" width="12" height="3" fill="#f8fafc"/>
          <rect x="2" y="7" width="12" height="3" fill="#fef3c7"/>
          <rect x="3" y="4" width="10" height="3" fill="#dc2626"/>
        `;
        break;

      case 'frozen_turkey':
        modernInner = `
          <ellipse cx="48" cy="54" rx="26" ry="20" fill="#d97706" stroke="#0f172a" stroke-width="3.5"/>
          <ellipse cx="64" cy="38" rx="14" ry="9" transform="rotate(-30 64 38)" fill="#b45309" stroke="#0f172a" stroke-width="3"/>
          <circle cx="75" cy="30" r="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="20" y="32" width="56" height="44" rx="12" fill="#bae6fd" opacity="0.35" stroke="#38bdf8" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="3" y="6" width="9" height="7" fill="#d97706"/>
          <rect x="10" y="4" width="3" height="3" fill="#b45309"/>
          <rect x="13" y="3" width="2" height="2" fill="#ffffff"/>
        `;
        break;

      case 'spaghetti_pot':
        modernInner = `
          <path d="M26 36 Q38 18 48 34 T70 36" stroke="#facc15" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="40" cy="32" r="5" fill="#7f1d1d"/>
          <circle cx="56" cy="30" r="5" fill="#991b1b"/>
          <rect x="20" y="38" width="56" height="40" rx="6" fill="#94a3b8" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M12 44 H20 M76 44 H84" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
          <path d="M24 38 Q32 50 40 38 T56 38 T72 38" fill="#dc2626"/>
        `;
        retroInner = `
          <rect x="4" y="3" width="8" height="3" fill="#facc15"/>
          <rect x="6" y="2" width="2" height="2" fill="#991b1b"/>
          <rect x="3" y="6" width="10" height="8" fill="#94a3b8"/>
          <rect x="4" y="6" width="8" height="2" fill="#dc2626"/>
        `;
        break;

      case 'floppy_disk_box':
        modernInner = `
          <path d="M18 14 H68 L78 24 V80 H18 Z" fill="#2563eb" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="30" y="14" width="28" height="22" fill="#cbd5e1" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="48" y="18" width="6" height="14" fill="#1e293b"/>
          <rect x="26" y="44" width="44" height="36" rx="2" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="32" y1="54" x2="64" y2="54" stroke="#ef4444" stroke-width="3"/>
          <line x1="32" y1="64" x2="64" y2="64" stroke="#3b82f6" stroke-width="3"/>
        `;
        retroInner = `
          <rect x="2" y="1" width="12" height="14" fill="#2563eb"/>
          <rect x="5" y="1" width="6" height="5" fill="#cbd5e1"/>
          <rect x="4" y="8" width="8" height="7" fill="#f8fafc"/>
        `;
        break;

      case 'boom_box':
        modernInner = `
          <path d="M28 28 V18 H68 V28" stroke="#64748b" stroke-width="4" fill="none" stroke-linejoin="round"/>
          <rect x="12" y="28" width="72" height="46" rx="6" fill="#334155" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="28" cy="52" r="13" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
          <circle cx="28" cy="52" r="4" fill="#94a3b8"/>
          <circle cx="68" cy="52" r="13" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
          <circle cx="68" cy="52" r="4" fill="#94a3b8"/>
          <rect x="43" y="44" width="10" height="14" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="4" y="2" width="8" height="2" fill="#94a3b8"/>
          <rect x="1" y="4" width="14" height="9" fill="#334155"/>
          <rect x="2" y="6" width="4" height="5" fill="#0f172a"/>
          <rect x="10" y="6" width="4" height="5" fill="#0f172a"/>
          <rect x="7" y="7" width="2" height="3" fill="#facc15"/>
        `;
        break;

      case 'typewriter':
        modernInner = `
          <rect x="28" y="12" width="40" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="18" y="30" width="60" height="8" rx="4" fill="#334155" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M16 38 H80 L84 76 H12 Z" fill="#0f172a" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <circle cx="26" cy="58" r="3" fill="#e2e8f0"/>
          <circle cx="36" cy="58" r="3" fill="#e2e8f0"/>
          <circle cx="48" cy="58" r="3" fill="#e2e8f0"/>
          <circle cx="60" cy="58" r="3" fill="#e2e8f0"/>
          <circle cx="70" cy="58" r="3" fill="#e2e8f0"/>
          <rect x="34" y="67" width="28" height="4" rx="2" fill="#f59e0b"/>
        `;
        retroInner = `
          <rect x="4" y="1" width="8" height="5" fill="#ffffff"/>
          <rect x="2" y="6" width="12" height="8" fill="#0f172a"/>
          <rect x="4" y="9" width="8" height="2" fill="#e2e8f0"/>
        `;
        break;

      case 'cassette_collection':
        modernInner = `
          <rect x="12" y="24" width="72" height="46" rx="5" fill="#7c3aed" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="20" y="30" width="56" height="24" rx="3" fill="#f59e0b" stroke="#0f172a" stroke-width="2"/>
          <circle cx="34" cy="42" r="6" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
          <circle cx="62" cy="42" r="6" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
          <polygon points="26,70 32,58 64,58 70,70" fill="#4c1d95" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="1" y="3" width="14" height="10" fill="#7c3aed"/>
          <rect x="3" y="5" width="10" height="5" fill="#f59e0b"/>
          <rect x="4" y="6" width="2" height="2" fill="#0f172a"/>
          <rect x="10" y="6" width="2" height="2" fill="#0f172a"/>
        `;
        break;

      case 'garden_gnome':
        modernInner = `
          <polygon points="48,6 28,38 68,38" fill="#dc2626" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <ellipse cx="48" cy="42" rx="14" ry="8" fill="#fde68a" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M32 44 Q48 72 64 44 Z" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
          <circle cx="48" cy="43" r="4.5" fill="#f87171" stroke="#0f172a" stroke-width="2"/>
          <rect x="32" y="56" width="32" height="22" rx="5" fill="#2563eb" stroke="#0f172a" stroke-width="3"/>
        `;
        retroInner = `
          <rect x="6" y="1" width="4" height="4" fill="#dc2626"/>
          <rect x="4" y="5" width="8" height="3" fill="#fde68a"/>
          <rect x="4" y="8" width="8" height="3" fill="#ffffff"/>
          <rect x="4" y="11" width="8" height="4" fill="#2563eb"/>
        `;
        break;

      case 'traffic_cone':
        modernInner = `
          <polygon points="48,12 24,74 72,74" fill="#f97316" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="39,35 57,35 60,44 36,44" fill="#ffffff"/>
          <polygon points="33,52 63,52 66,61 30,61" fill="#ffffff"/>
          <rect x="16" y="72" width="64" height="8" rx="3" fill="#ea580c" stroke="#0f172a" stroke-width="3.5"/>
        `;
        retroInner = `
          <rect x="7" y="2" width="2" height="3" fill="#f97316"/>
          <rect x="5" y="5" width="6" height="3" fill="#ffffff"/>
          <rect x="4" y="8" width="8" height="4" fill="#f97316"/>
          <rect x="2" y="12" width="12" height="2" fill="#ea580c"/>
        `;
        break;

      case 'lava_lamp':
        modernInner = `
          <polygon points="41,8 55,8 52,20 44,20" fill="#cbd5e1" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
          <polygon points="44,20 52,20 65,58 31,58" fill="#4c1d95" fill-opacity="0.88" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M33 56 C36 49 60 49 63 56 Z" fill="#f43f5e"/>
          <ellipse cx="48" cy="45" rx="7.5" ry="9.5" fill="#ec4899"/>
          <circle cx="44" cy="31" r="5" fill="#f97316"/>
          <circle cx="52" cy="36" r="3.5" fill="#facc15"/>
          <line x1="42" y1="24" x2="36" y2="54" stroke="rgba(255,255,255,0.45)" stroke-width="2.5" stroke-linecap="round"/>
          <polygon points="31,58 65,58 55,72 41,72" fill="#cbd5e1" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="41,72 55,72 62,84 34,84" fill="#94a3b8" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
        `;
        retroInner = `
          <rect x="6" y="1" width="4" height="2" fill="#cbd5e1"/>
          <rect x="5" y="3" width="6" height="8" fill="#4c1d95"/>
          <rect x="7" y="4" width="2" height="2" fill="#facc15"/>
          <rect x="6" y="7" width="4" height="3" fill="#ec4899"/>
          <rect x="5" y="11" width="6" height="2" fill="#cbd5e1"/>
          <rect x="4" y="13" width="8" height="2" fill="#94a3b8"/>
        `;
        break;

      case 'shopping_cart':
        modernInner = `
          <path d="M14 20 H24 L30 58 H72 L78 28 H26" fill="none" stroke="#64748b" stroke-width="4" stroke-linejoin="round"/>
          <line x1="38" y1="28" x2="40" y2="58" stroke="#94a3b8" stroke-width="2.5"/>
          <line x1="50" y1="28" x2="50" y2="58" stroke="#94a3b8" stroke-width="2.5"/>
          <line x1="62" y1="28" x2="60" y2="58" stroke="#94a3b8" stroke-width="2.5"/>
          <line x1="28" y1="42" x2="75" y2="42" stroke="#94a3b8" stroke-width="2.5"/>
          <path d="M30 58 L26 68 H70" fill="none" stroke="#475569" stroke-width="3.5"/>
          <circle cx="32" cy="74" r="5" fill="#ef4444" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="66" cy="74" r="5" fill="#ef4444" stroke="#0f172a" stroke-width="2.5"/>
        `;
        retroInner = `
          <rect x="2" y="3" width="2" height="2" fill="#ef4444"/>
          <rect x="4" y="4" width="10" height="6" fill="#94a3b8"/>
          <rect x="4" y="12" width="2" height="2" fill="#0f172a"/>
          <rect x="11" y="12" width="2" height="2" fill="#0f172a"/>
        `;
        break;

      case 'mailbox':
        modernInner = `
          <rect x="43" y="52" width="10" height="30" fill="#78350f" stroke="#0f172a" stroke-width="3"/>
          <path d="M18 52 V34 C18 22 32 22 44 22 H66 C74 22 78 28 78 36 V52 Z" fill="#1d4ed8" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <line x1="54" y1="38" x2="54" y2="14" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
          <rect x="54" y="12" width="12" height="8" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="9" y="1" width="3" height="4" fill="#ef4444"/>
          <rect x="3" y="4" width="10" height="6" fill="#1d4ed8"/>
          <rect x="7" y="10" width="2" height="5" fill="#78350f"/>
        `;
        break;

      case 'trampoline':
        modernInner = `
          <ellipse cx="48" cy="40" rx="34" ry="14" fill="#3b82f6" stroke="#0f172a" stroke-width="3.5"/>
          <ellipse cx="48" cy="40" rx="25" ry="9" fill="#1e293b" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3 2"/>
          <path d="M20 46 L24 72 L34 72 L36 52 M60 52 L62 72 L72 72 L76 46" fill="none" stroke="#475569" stroke-width="4" stroke-linejoin="round"/>
        `;
        retroInner = `
          <rect x="2" y="5" width="12" height="4" fill="#3b82f6"/>
          <rect x="4" y="6" width="8" height="2" fill="#1e293b"/>
          <rect x="3" y="9" width="2" height="5" fill="#64748b"/>
          <rect x="11" y="9" width="2" height="5" fill="#64748b"/>
        `;
        break;

      case 'dumpster':
        modernInner = `
          <polygon points="16,28 46,18 46,32 16,32" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
          <polygon points="48,28 80,28 76,20 48,20" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
          <polygon points="14,32 82,32 76,74 20,74" fill="#15803d" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <line x1="32" y1="36" x2="34" y2="70" stroke="#14532d" stroke-width="4"/>
          <line x1="48" y1="36" x2="48" y2="70" stroke="#14532d" stroke-width="4"/>
          <line x1="64" y1="36" x2="62" y2="70" stroke="#14532d" stroke-width="4"/>
        `;
        retroInner = `
          <rect x="2" y="3" width="12" height="2" fill="#1e293b"/>
          <rect x="2" y="5" width="12" height="9" fill="#15803d"/>
          <rect x="5" y="6" width="1" height="7" fill="#14532d"/>
          <rect x="10" y="6" width="1" height="7" fill="#14532d"/>
        `;
        break;

      case 'black_hole_orb':
        modernInner = `
          <ellipse cx="48" cy="48" rx="38" ry="12" transform="rotate(-18 48 48)" fill="none" stroke="#ec4899" stroke-width="5"/>
          <ellipse cx="48" cy="48" rx="32" ry="9" transform="rotate(-18 48 48)" fill="none" stroke="#facc15" stroke-width="3"/>
          <circle cx="48" cy="48" r="19" fill="#090d16" stroke="#6366f1" stroke-width="3.5"/>
        `;
        retroInner = `
          <rect x="1" y="6" width="14" height="4" fill="#ec4899"/>
          <rect x="4" y="4" width="8" height="8" fill="#090d16"/>
        `;
        break;

      case 'rubber_duck':
      case 'rubber_duck_emperor':
        modernInner = `
          <path d="M20 56 C20 42 34 42 44 45 C56 45 74 44 76 58 C77 71 65 78 48 78 C29 78 20 69 20 56 Z" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M32 56 C40 50 54 52 58 62 C50 67 36 66 32 56 Z" fill="#eab308" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="58" cy="33" r="16" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M70 31 L86 35 L71 41 Z" fill="#f97316" stroke="#0f172a" stroke-width="2.5"/>
          ${id === 'rubber_duck_emperor' ? '<polygon points="45,19 50,7 57,15 64,7 70,19" fill="#eab308" stroke="#0f172a" stroke-width="2.5"/><circle cx="57" cy="12" r="2" fill="#ef4444"/>' : ''}
          <circle cx="63" cy="30" r="3.2" fill="#0f172a"/>
        `;
        retroInner = `
          ${id === 'rubber_duck_emperor' ? '<rect x="7" y="1" width="5" height="2" fill="#eab308"/>' : ''}
          <rect x="8" y="3" width="4" height="4" fill="${c1}"/>
          <rect x="12" y="5" width="3" height="2" fill="#f97316"/>
          <rect x="10" y="4" width="1" height="1" fill="#0f172a"/>
          <rect x="3" y="7" width="10" height="6" fill="${c1}"/>
          <rect x="5" y="9" width="4" height="2" fill="#eab308"/>
        `;
        break;

      case 'refrigerator':
      case 'office_fridge':
        modernInner = `
          <rect x="22" y="10" width="52" height="72" rx="6" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <line x1="22" y1="34" x2="74" y2="34" stroke="#0f172a" stroke-width="3"/>
          <rect x="28" y="16" width="4" height="13" rx="2" fill="#64748b"/>
          <rect x="28" y="40" width="4" height="22" rx="2" fill="#64748b"/>
          ${id === 'refrigerator'
            ? '<rect x="52" y="42" width="14" height="16" rx="2" fill="#334155" stroke="#0f172a" stroke-width="2"/><rect x="56" y="46" width="6" height="8" fill="#38bdf8"/>'
            : '<rect x="46" y="18" width="10" height="10" fill="#fef08a" stroke="#0f172a" stroke-width="1.5"/><rect x="52" y="44" width="12" height="12" fill="#86efac" stroke="#0f172a" stroke-width="1.5"/>'}
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="14" fill="${c1}"/>
          <rect x="3" y="6" width="10" height="1" fill="#0f172a"/>
          <rect x="4" y="2" width="1" height="3" fill="#64748b"/>
          <rect x="4" y="8" width="1" height="4" fill="#64748b"/>
          <rect x="9" y="8" width="3" height="3" fill="${id === 'refrigerator' ? '#38bdf8' : '#fef08a'}"/>
        `;
        break;

      case 'vending_machine':
        modernInner = `
          <rect x="20" y="10" width="56" height="72" rx="5" fill="#dc2626" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="25" y="16" width="32" height="42" rx="3" fill="#e0f2fe" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="29" y="20" width="8" height="9" fill="#facc15"/><rect x="43" y="20" width="8" height="9" fill="#22c55e"/>
          <rect x="29" y="33" width="8" height="9" fill="#3b82f6"/><rect x="43" y="33" width="8" height="9" fill="#ec4899"/>
          <rect x="29" y="46" width="8" height="9" fill="#f97316"/><rect x="43" y="46" width="8" height="9" fill="#a855f7"/>
          <rect x="61" y="24" width="10" height="24" rx="2" fill="#1e293b"/>
          <circle cx="66" cy="30" r="2.5" fill="#facc15"/>
          <rect x="26" y="64" width="34" height="11" rx="2" fill="#0f172a"/>
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="14" fill="#dc2626"/>
          <rect x="4" y="2" width="6" height="9" fill="#bae6fd"/>
          <rect x="5" y="3" width="2" height="2" fill="#facc15"/>
          <rect x="8" y="3" width="2" height="2" fill="#22c55e"/>
          <rect x="5" y="7" width="2" height="2" fill="#3b82f6"/>
          <rect x="4" y="12" width="6" height="2" fill="#0f172a"/>
        `;
        break;

      case 'server_rack':
        modernInner = `
          <rect x="22" y="10" width="52" height="72" rx="4" fill="#0f172a" stroke="#334155" stroke-width="3.5"/>
          <rect x="27" y="16" width="42" height="10" rx="1.5" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          <rect x="27" y="30" width="42" height="10" rx="1.5" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          <rect x="27" y="44" width="42" height="10" rx="1.5" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          <rect x="27" y="58" width="42" height="10" rx="1.5" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          <circle cx="33" cy="21" r="2" fill="#22c55e"/><circle cx="40" cy="21" r="2" fill="#22c55e"/><circle cx="63" cy="21" r="2" fill="#38bdf8"/>
          <circle cx="33" cy="35" r="2" fill="#22c55e"/><circle cx="40" cy="35" r="2" fill="#ef4444"/><circle cx="63" cy="35" r="2" fill="#22c55e"/>
          <circle cx="33" cy="49" r="2" fill="#22c55e"/><circle cx="40" cy="49" r="2" fill="#22c55e"/><circle cx="63" cy="49" r="2" fill="#facc15"/>
          <circle cx="33" cy="63" r="2" fill="#ef4444"/><circle cx="40" cy="63" r="2" fill="#22c55e"/><circle cx="63" cy="63" r="2" fill="#22c55e"/>
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="14" fill="#0f172a"/>
          <rect x="4" y="2" width="8" height="2" fill="#334155"/>
          <rect x="4" y="6" width="8" height="2" fill="#334155"/>
          <rect x="4" y="10" width="8" height="2" fill="#334155"/>
          <rect x="5" y="2" width="1" height="1" fill="#22c55e"/>
          <rect x="5" y="6" width="1" height="1" fill="#ef4444"/>
          <rect x="5" y="10" width="1" height="1" fill="#22c55e"/>
        `;
        break;

      case 'engine_block':
        modernInner = `
          <polygon points="14,34 32,22 44,34 52,34 64,22 82,34 72,62 24,62" fill="#64748b" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="20" y="24" width="18" height="8" rx="2" transform="rotate(-25 29 28)" fill="#dc2626" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="58" y="24" width="18" height="8" rx="2" transform="rotate(25 67 28)" fill="#dc2626" stroke="#0f172a" stroke-width="2.5"/>
          <ellipse cx="48" cy="22" rx="14" ry="6" fill="#cbd5e1" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="28" y="62" width="40" height="14" rx="4" fill="#334155" stroke="#0f172a" stroke-width="3"/>
          <circle cx="48" cy="46" r="8" fill="#1e293b" stroke="#facc15" stroke-width="2.5"/>
          <circle cx="38" cy="60" r="6" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="58" cy="60" r="6" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="5" y="2" width="6" height="2" fill="#cbd5e1"/>
          <rect x="2" y="4" width="4" height="4" fill="#dc2626"/>
          <rect x="10" y="4" width="4" height="4" fill="#dc2626"/>
          <rect x="4" y="5" width="8" height="8" fill="#64748b"/>
          <rect x="6" y="7" width="4" height="4" fill="#1e293b"/>
        `;
        break;

      case 'metal_locker':
        modernInner = `
          <rect x="26" y="10" width="44" height="72" rx="4" fill="#64748b" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="30" y="14" width="36" height="64" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <line x1="36" y1="22" x2="60" y2="22" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="36" y1="27" x2="60" y2="27" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="36" y1="32" x2="60" y2="32" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="36" y1="64" x2="60" y2="64" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="36" y1="69" x2="60" y2="69" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="58" y="44" width="5" height="10" rx="1.5" fill="#1e293b"/>
        `;
        retroInner = `
          <rect x="4" y="1" width="8" height="14" fill="#64748b"/>
          <rect x="5" y="2" width="6" height="12" fill="#94a3b8"/>
          <rect x="6" y="3" width="4" height="1" fill="#0f172a"/>
          <rect x="6" y="5" width="4" height="1" fill="#0f172a"/>
          <rect x="9" y="8" width="1" height="2" fill="#0f172a"/>
        `;
        break;

      case 'manhole_cover':
        modernInner = `
          <circle cx="48" cy="48" r="32" fill="#334155" stroke="#0f172a" stroke-width="4"/>
          <circle cx="48" cy="48" r="25" fill="#475569" stroke="#1e293b" stroke-width="3"/>
          <line x1="25" y1="40" x2="71" y2="40" stroke="#1e293b" stroke-width="2.5"/>
          <line x1="25" y1="48" x2="71" y2="48" stroke="#1e293b" stroke-width="2.5"/>
          <line x1="25" y1="56" x2="71" y2="56" stroke="#1e293b" stroke-width="2.5"/>
          <line x1="40" y1="25" x2="40" y2="71" stroke="#1e293b" stroke-width="2.5"/>
          <line x1="48" y1="25" x2="48" y2="71" stroke="#1e293b" stroke-width="2.5"/>
          <line x1="56" y1="25" x2="56" y2="71" stroke="#1e293b" stroke-width="2.5"/>
          <rect x="20" y="45" width="5" height="6" rx="2" fill="#0f172a"/>
          <rect x="71" y="45" width="5" height="6" rx="2" fill="#0f172a"/>
        `;
        retroInner = `
          <rect x="3" y="3" width="10" height="10" fill="#334155"/>
          <rect x="4" y="4" width="8" height="8" fill="#475569"/>
          <rect x="5" y="7" width="6" height="2" fill="#1e293b"/>
          <rect x="7" y="5" width="2" height="6" fill="#1e293b"/>
        `;
        break;

      case 'filing_cabinet':
      case 'angry_filing_cabinet': {
        const isAngry = id === 'angry_filing_cabinet';
        modernInner = `
          <rect x="24" y="10" width="48" height="72" rx="4" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="29" y="15" width="38" height="19" rx="2" fill="${c2}" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="29" y="37" width="38" height="19" rx="2" fill="${isAngry ? '#0f172a' : c2}" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="29" y="59" width="38" height="19" rx="2" fill="${c2}" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="42" y="22" width="12" height="5" rx="1" fill="#475569"/>
          <rect x="42" y="66" width="12" height="5" rx="1" fill="#475569"/>
          ${isAngry
            ? '<line x1="33" y1="19" x2="43" y2="25" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/><line x1="63" y1="19" x2="53" y2="25" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/><polygon points="32,37 36,44 40,37 44,44 48,37 52,44 56,37 60,44 64,37" fill="#ffffff"/>'
            : '<rect x="42" y="44" width="12" height="5" rx="1" fill="#475569"/>'}
        `;
        retroInner = `
          <rect x="4" y="1" width="8" height="14" fill="${c1}"/>
          <rect x="5" y="2" width="6" height="3" fill="${c2}"/>
          <rect x="5" y="6" width="6" height="4" fill="${isAngry ? '#0f172a' : c2}"/>
          <rect x="5" y="11" width="6" height="3" fill="${c2}"/>
          ${isAngry ? '<rect x="6" y="6" width="4" height="1" fill="#ffffff"/>' : ''}
        `;
        break;
      }

      case 'birthday_cake':
      case 'wedding_cake':
        modernInner = `
          <rect x="16" y="54" width="64" height="24" rx="5" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="26" y="34" width="44" height="22" rx="4" fill="${c2}" stroke="#0f172a" stroke-width="3"/>
          <path d="M18 58 Q26 66 34 58 T50 58 T66 58 T78 58" stroke="${c3}" stroke-width="4" fill="none"/>
          ${id === 'wedding_cake'
            ? '<rect x="34" y="18" width="28" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="3"/><circle cx="45" cy="12" r="4" fill="#1e293b"/><circle cx="51" cy="12" r="4" fill="#f43f5e"/>'
            : '<rect x="36" y="18" width="5" height="16" fill="#fef08a" stroke="#0f172a" stroke-width="2"/><circle cx="38.5" cy="14" r="4" fill="#f97316"/><rect x="55" y="18" width="5" height="16" fill="#fef08a" stroke="#0f172a" stroke-width="2"/><circle cx="57.5" cy="14" r="4" fill="#f97316"/>'}
        `;
        retroInner = `
          <rect x="5" y="2" width="6" height="3" fill="#f97316"/>
          <rect x="4" y="5" width="8" height="4" fill="${c2}"/>
          <rect x="2" y="9" width="12" height="6" fill="${c1}"/>
        `;
        break;

      case 'banana_crate':
        modernInner = `
          <path d="M24 38 C28 18 46 18 52 34 M38 36 C44 16 64 16 70 36 M30 42 C42 26 58 26 66 42" stroke="#facc15" stroke-width="8" fill="none" stroke-linecap="round"/>
          <rect x="16" y="38" width="64" height="40" rx="4" fill="#a16207" stroke="#0f172a" stroke-width="3.5"/>
          <line x1="16" y1="50" x2="80" y2="50" stroke="#0f172a" stroke-width="3"/>
          <line x1="16" y1="64" x2="80" y2="64" stroke="#0f172a" stroke-width="3"/>
        `;
        retroInner = `
          <rect x="4" y="2" width="8" height="4" fill="#facc15"/>
          <rect x="2" y="6" width="12" height="8" fill="#a16207"/>
          <rect x="3" y="8" width="10" height="1" fill="#78350f"/>
        `;
        break;

      case 'pudding_cup':
        modernInner = `
          <path d="M24 32 C36 18 58 20 68 28" stroke="#cbd5e1" stroke-width="4" fill="none" stroke-linecap="round"/>
          <ellipse cx="48" cy="36" rx="24" ry="8" fill="#78350f" stroke="#0f172a" stroke-width="3"/>
          <polygon points="22,36 74,36 64,76 32,76" fill="#fef3c7" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="25,46 71,46 64,76 32,76" fill="#d97706"/>
        `;
        retroInner = `
          <rect x="3" y="4" width="10" height="3" fill="#78350f"/>
          <rect x="4" y="7" width="8" height="7" fill="#d97706"/>
        `;
        break;

      case 'giant_marshmallow':
        modernInner = `
          <rect x="24" y="18" width="48" height="60" rx="14" fill="#ffffff" stroke="#0f172a" stroke-width="3.5"/>
          <ellipse cx="48" cy="24" rx="22" ry="7" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <circle cx="38" cy="46" r="3.5" fill="#0f172a"/>
          <circle cx="58" cy="46" r="3.5" fill="#0f172a"/>
          <ellipse cx="33" cy="52" rx="4" ry="2.5" fill="#f472b6"/>
          <ellipse cx="63" cy="52" rx="4" ry="2.5" fill="#f472b6"/>
          <path d="M44 52 Q48 56 52 52" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="4" y="2" width="8" height="12" fill="#ffffff"/>
          <rect x="5" y="6" width="2" height="2" fill="#0f172a"/>
          <rect x="9" y="6" width="2" height="2" fill="#0f172a"/>
          <rect x="6" y="9" width="4" height="1" fill="#f472b6"/>
        `;
        break;

      case 'water_cooler_jug':
        modernInner = `
          <rect x="41" y="10" width="14" height="8" rx="2" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="43" y="18" width="10" height="8" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="26" y="26" width="44" height="54" rx="10" fill="#38bdf8" fill-opacity="0.82" stroke="#0f172a" stroke-width="3.5"/>
          <line x1="28" y1="40" x2="68" y2="40" stroke="#0284c7" stroke-width="3"/>
          <line x1="28" y1="54" x2="68" y2="54" stroke="#0284c7" stroke-width="3"/>
          <line x1="28" y1="68" x2="68" y2="68" stroke="#0284c7" stroke-width="3"/>
        `;
        retroInner = `
          <rect x="6" y="1" width="4" height="3" fill="#0284c7"/>
          <rect x="4" y="4" width="8" height="11" fill="#38bdf8"/>
          <rect x="4" y="7" width="8" height="1" fill="#0284c7"/>
          <rect x="4" y="11" width="8" height="1" fill="#0284c7"/>
        `;
        break;

      case 'taco_box':
        modernInner = `
          <path d="M18 48 A16 16 0 0 1 46 48 Z" fill="#facc15" stroke="#0f172a" stroke-width="3"/>
          <path d="M36 46 A16 16 0 0 1 64 46 Z" fill="#f59e0b" stroke="#0f172a" stroke-width="3"/>
          <path d="M52 48 A16 16 0 0 1 78 48 Z" fill="#facc15" stroke="#0f172a" stroke-width="3"/>
          <circle cx="32" cy="36" r="4" fill="#22c55e"/><circle cx="48" cy="34" r="4" fill="#ef4444"/><circle cx="64" cy="36" r="4" fill="#22c55e"/>
          <rect x="14" y="48" width="68" height="28" rx="4" fill="#ea580c" stroke="#0f172a" stroke-width="3.5"/>
        `;
        retroInner = `
          <rect x="3" y="4" width="10" height="4" fill="#facc15"/>
          <rect x="4" y="3" width="8" height="2" fill="#22c55e"/>
          <rect x="2" y="8" width="12" height="6" fill="#ea580c"/>
        `;
        break;

      case 'apple_ii':
      case 'commodore_64':
      case 'crt_monitor':
        modernInner = `
          <rect x="20" y="14" width="56" height="44" rx="6" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="26" y="20" width="44" height="32" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="32" y="38" font-family="monospace" font-weight="900" font-size="11" fill="${c2}">READY.</text>
          <rect x="32" y="42" width="7" height="3" fill="${c2}"/>
          <polygon points="14,62 82,62 86,78 10,78" fill="${c1}" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <line x1="22" y1="68" x2="74" y2="68" stroke="#475569" stroke-width="3" stroke-dasharray="4 3"/>
          <line x1="20" y1="73" x2="76" y2="73" stroke="#475569" stroke-width="3" stroke-dasharray="4 3"/>
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="9" fill="${c1}"/>
          <rect x="4" y="2" width="8" height="7" fill="#0f172a"/>
          <rect x="5" y="4" width="4" height="2" fill="${c2}"/>
          <rect x="1" y="10" width="14" height="4" fill="${c1}"/>
          <rect x="3" y="11" width="10" height="2" fill="#475569"/>
        `;
        break;

      case 'dot_matrix_printer':
      case 'laser_printer':
      case 'emotionally_damaged_printer': {
        const isSad = id === 'emotionally_damaged_printer';
        modernInner = `
          <rect x="28" y="10" width="40" height="22" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="34" y1="17" x2="62" y2="17" stroke="#64748b" stroke-width="2.5"/>
          <line x1="34" y1="23" x2="58" y2="23" stroke="#64748b" stroke-width="2.5"/>
          <rect x="14" y="30" width="68" height="38" rx="6" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="24" y="58" width="48" height="16" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5"/>
          ${isSad
            ? '<circle cx="36" cy="44" r="4" fill="#0f172a"/><circle cx="60" cy="44" r="4" fill="#0f172a"/><path d="M36 48 V64 M60 48 V64" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/><path d="M42 53 Q48 47 54 53" stroke="#0f172a" stroke-width="3" fill="none"/>'
            : '<circle cx="70" cy="40" r="3.5" fill="#22c55e"/><rect x="24" y="38" width="36" height="8" rx="2" fill="#334155"/>'}
        `;
        retroInner = `
          <rect x="4" y="1" width="8" height="4" fill="#ffffff"/>
          <rect x="2" y="5" width="12" height="7" fill="${c1}"/>
          <rect x="4" y="12" width="8" height="3" fill="#f8fafc"/>
          ${isSad ? '<rect x="5" y="7" width="2" height="5" fill="#38bdf8"/><rect x="9" y="7" width="2" height="5" fill="#38bdf8"/>' : ''}
        `;
        break;
      }

      case 'vcr':
        modernInner = `
          <rect x="10" y="34" width="76" height="30" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="16" y="41" width="36" height="10" rx="1.5" fill="#0f172a" stroke="#475569" stroke-width="2"/>
          <rect x="56" y="40" width="22" height="12" rx="2" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
          <text x="67" y="49" text-anchor="middle" font-family="monospace" font-weight="900" font-size="9" fill="#ef4444">12:00</text>
          <circle cx="20" cy="57" r="2.5" fill="#cbd5e1"/><circle cx="28" cy="57" r="2.5" fill="#cbd5e1"/><circle cx="36" cy="57" r="2.5" fill="#ef4444"/>
        `;
        retroInner = `
          <rect x="1" y="5" width="14" height="6" fill="#1e293b"/>
          <rect x="2" y="6" width="7" height="2" fill="#0f172a"/>
          <rect x="10" y="6" width="4" height="2" fill="#ef4444"/>
        `;
        break;

      case 'fax_machine':
        modernInner = `
          <rect x="34" y="10" width="38" height="20" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="16" y="28" width="64" height="42" rx="6" fill="#d6d3d1" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="18" y="24" width="12" height="46" rx="5" fill="#78716c" stroke="#0f172a" stroke-width="3"/>
          <rect x="36" y="36" width="22" height="22" rx="2" fill="#44403c"/>
          <path d="M34 70 L30 82 H68 L64 70 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
        `;
        retroInner = `
          <rect x="5" y="1" width="7" height="4" fill="#ffffff"/>
          <rect x="2" y="5" width="12" height="7" fill="#d6d3d1"/>
          <rect x="2" y="4" width="3" height="9" fill="#57534e"/>
          <rect x="5" y="12" width="7" height="3" fill="#ffffff"/>
        `;
        break;

      case 'palm_pilot':
        modernInner = `
          <rect x="26" y="10" width="44" height="74" rx="8" fill="#475569" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="32" y="16" width="32" height="38" rx="2" fill="#84cc16" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="32" y="56" width="32" height="12" rx="1.5" fill="#334155"/>
          <circle cx="36" cy="75" r="3" fill="#cbd5e1"/><circle cx="44" cy="75" r="3" fill="#cbd5e1"/>
          <circle cx="52" cy="75" r="3" fill="#cbd5e1"/><circle cx="60" cy="75" r="3" fill="#cbd5e1"/>
          <line x1="74" y1="18" x2="74" y2="70" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="4" y="1" width="8" height="14" fill="#475569"/>
          <rect x="5" y="2" width="6" height="7" fill="#84cc16"/>
          <rect x="5" y="10" width="6" height="2" fill="#1e293b"/>
          <rect x="13" y="2" width="1" height="11" fill="#38bdf8"/>
        `;
        break;

      case 'inflatable_flamingo':
        modernInner = `
          <ellipse cx="48" cy="62" rx="28" ry="14" fill="#ec4899" stroke="#0f172a" stroke-width="3.5"/>
          <ellipse cx="48" cy="62" rx="10" ry="4.5" fill="#e0f2fe" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M62 54 C72 38 54 26 62 16 C66 12 74 14 74 20" stroke="#ec4899" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M62 54 C72 38 54 26 62 16 C66 12 74 14 74 20" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
          <polygon points="72,18 84,22 72,26" fill="#0f172a"/>
        `;
        retroInner = `
          <rect x="9" y="2" width="3" height="6" fill="#ec4899"/>
          <rect x="12" y="3" width="2" height="2" fill="#0f172a"/>
          <rect x="2" y="8" width="12" height="5" fill="#ec4899"/>
          <rect x="6" y="9" width="4" height="2" fill="#e0f2fe"/>
        `;
        break;

      case 'bean_bag_chair':
        modernInner = `
          <path d="M48 16 C66 16 80 42 78 62 C76 76 62 80 48 80 C34 80 20 76 18 62 C16 42 30 16 48 16 Z" fill="#8b5cf6" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M32 48 Q48 60 64 48" stroke="#6d28d9" stroke-width="4" fill="none" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="6" y="2" width="4" height="3" fill="#8b5cf6"/>
          <rect x="3" y="5" width="10" height="8" fill="#8b5cf6"/>
          <rect x="5" y="7" width="6" height="2" fill="#6d28d9"/>
        `;
        break;

      case 'disco_ball':
        modernInner = `
          <line x1="48" y1="6" x2="48" y2="18" stroke="#64748b" stroke-width="3"/>
          <circle cx="48" cy="50" r="30" fill="#cbd5e1" stroke="#0f172a" stroke-width="3.5"/>
          <ellipse cx="48" cy="50" rx="30" ry="12" fill="none" stroke="#475569" stroke-width="2"/>
          <ellipse cx="48" cy="50" rx="12" ry="30" fill="none" stroke="#475569" stroke-width="2"/>
          <polygon points="24,24 27,18 30,24 36,27 30,30 27,36 24,30 18,27" fill="#facc15"/>
          <polygon points="72,30 74,25 76,30 81,32 76,34 74,39 72,34 67,32" fill="#38bdf8"/>
        `;
        retroInner = `
          <rect x="7" y="1" width="2" height="2" fill="#94a3b8"/>
          <rect x="3" y="3" width="10" height="10" fill="#cbd5e1"/>
          <rect x="5" y="5" width="2" height="2" fill="#ffffff"/>
          <rect x="9" y="8" width="2" height="2" fill="#38bdf8"/>
          <rect x="2" y="2" width="2" height="2" fill="#facc15"/>
        `;
        break;

      case 'pinata':
        modernInner = `
          <rect x="26" y="38" width="38" height="20" rx="6" fill="#ec4899" stroke="#0f172a" stroke-width="3"/>
          <rect x="36" y="38" width="10" height="20" fill="#facc15"/>
          <rect x="46" y="38" width="10" height="20" fill="#38bdf8"/>
          <rect x="28" y="56" width="8" height="22" rx="2" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="54" y="56" width="8" height="22" rx="2" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M54 40 L64 18 L76 24 L64 44 Z" fill="#ec4899" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
          <polygon points="62,18 58,8 68,14" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
          <path d="M26 42 L14 34" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="9" y="2" width="4" height="5" fill="#ec4899"/>
          <rect x="4" y="6" width="8" height="4" fill="#facc15"/>
          <rect x="6" y="6" width="3" height="4" fill="#38bdf8"/>
          <rect x="4" y="10" width="2" height="4" fill="#ec4899"/>
          <rect x="10" y="10" width="2" height="4" fill="#38bdf8"/>
        `;
        break;

      case 'coffee_machine':
        modernInner = `
          <path d="M24 12 H70 V32 H44 V66 H70 V78 H24 Z" fill="#1e293b" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <circle cx="54" cy="52" r="13" fill="#bae6fd" fill-opacity="0.7" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M42 54 A12 12 0 0 0 66 54 Z" fill="#451a03"/>
          <path d="M67 44 H75 V58 H67" fill="none" stroke="#0f172a" stroke-width="3"/>
          <circle cx="34" cy="22" r="3" fill="#ef4444"/>
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="4" fill="#1e293b"/>
          <rect x="3" y="5" width="4" height="9" fill="#1e293b"/>
          <rect x="8" y="6" width="5" height="6" fill="#451a03"/>
          <rect x="3" y="12" width="10" height="2" fill="#1e293b"/>
        `;
        break;

      case 'conference_table':
        modernInner = `
          <polygon points="10,44 26,30 86,30 70,44" fill="#92400e" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="10" y="44" width="60" height="6" fill="#78350f" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="24" y="50" width="8" height="24" fill="#451a03" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="58" y="50" width="8" height="24" fill="#451a03" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="38" y="28" width="14" height="9" rx="1" fill="#cbd5e1" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="1" y="5" width="14" height="3" fill="#92400e"/>
          <rect x="3" y="8" width="2" height="6" fill="#451a03"/>
          <rect x="11" y="8" width="2" height="6" fill="#451a03"/>
        `;
        break;

      case 'network_switch':
        modernInner = `
          <rect x="10" y="34" width="76" height="26" rx="3" fill="#0284c7" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="16" y="40" width="48" height="14" fill="#0f172a"/>
          <circle cx="20" cy="44" r="2" fill="#22c55e"/><circle cx="28" cy="44" r="2" fill="#22c55e"/><circle cx="36" cy="44" r="2" fill="#facc15"/><circle cx="44" cy="44" r="2" fill="#22c55e"/><circle cx="52" cy="44" r="2" fill="#22c55e"/>
          <path d="M28 50 Q24 72 16 78 M44 50 Q48 72 56 78" stroke="#facc15" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="1" y="5" width="14" height="5" fill="#0284c7"/>
          <rect x="2" y="6" width="8" height="3" fill="#0f172a"/>
          <rect x="3" y="7" width="1" height="1" fill="#22c55e"/>
          <rect x="6" y="7" width="1" height="1" fill="#facc15"/>
        `;
        break;

      case 'document_shredder':
        modernInner = `
          <rect x="32" y="8" width="32" height="20" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="20" y="26" width="56" height="12" rx="3" fill="#64748b" stroke="#0f172a" stroke-width="3"/>
          <rect x="24" y="38" width="48" height="42" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="34" y="46" width="28" height="26" rx="2" fill="#0f172a"/>
          <line x1="38" y1="46" x2="38" y2="72" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="6 3"/>
          <line x1="48" y1="46" x2="48" y2="72" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="5 4"/>
          <line x1="58" y1="46" x2="58" y2="72" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="6 3"/>
        `;
        retroInner = `
          <rect x="5" y="1" width="6" height="4" fill="#ffffff"/>
          <rect x="3" y="5" width="10" height="2" fill="#64748b"/>
          <rect x="4" y="7" width="8" height="8" fill="#1e293b"/>
          <rect x="6" y="8" width="1" height="5" fill="#ffffff"/>
          <rect x="9" y="8" width="1" height="5" fill="#ffffff"/>
        `;
        break;

      case 'whiteboard':
        modernInner = `
          <rect x="12" y="20" width="72" height="48" rx="3" fill="#ffffff" stroke="#64748b" stroke-width="4"/>
          <polyline points="22,56 38,42 50,48 72,28" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="22" y="28" width="8" height="14" fill="#3b82f6"/><rect x="34" y="32" width="8" height="10" fill="#22c55e"/>
          <rect x="8" y="68" width="80" height="5" fill="#475569"/>
        `;
        retroInner = `
          <rect x="1" y="3" width="14" height="10" fill="#ffffff"/>
          <rect x="3" y="8" width="3" height="3" fill="#3b82f6"/>
          <rect x="8" y="5" width="4" height="3" fill="#ef4444"/>
          <rect x="1" y="13" width="14" height="1" fill="#475569"/>
        `;
        break;

      case 'cubicle_divider':
        modernInner = `
          <rect x="18" y="14" width="60" height="58" rx="2" fill="#64748b" stroke="#334155" stroke-width="4"/>
          <line x1="48" y1="14" x2="48" y2="72" stroke="#334155" stroke-width="3"/>
          <rect x="26" y="24" width="12" height="12" fill="#fef08a" stroke="#0f172a" stroke-width="1.5"/>
          <rect x="56" y="30" width="12" height="12" fill="#f472b6" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="14" y1="76" x2="30" y2="76" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
          <line x1="66" y1="76" x2="82" y2="76" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="2" y="2" width="12" height="11" fill="#64748b"/>
          <rect x="4" y="4" width="3" height="3" fill="#fef08a"/>
          <rect x="9" y="5" width="3" height="3" fill="#f472b6"/>
          <rect x="1" y="13" width="4" height="2" fill="#0f172a"/>
          <rect x="11" y="13" width="4" height="2" fill="#0f172a"/>
        `;
        break;

      case 'punch_clock':
        modernInner = `
          <rect x="38" y="8" width="20" height="18" fill="#fef3c7" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="24" y="24" width="48" height="56" rx="6" fill="#475569" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="48" cy="50" r="16" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
          <polyline points="48,39 48,50 56,50" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
        `;
        retroInner = `
          <rect x="6" y="1" width="4" height="3" fill="#fef3c7"/>
          <rect x="3" y="4" width="10" height="11" fill="#475569"/>
          <rect x="5" y="6" width="6" height="6" fill="#ffffff"/>
          <rect x="7" y="7" width="2" height="3" fill="#dc2626"/>
        `;
        break;

      case 'paper_pallet':
        modernInner = `
          <rect x="18" y="18" width="28" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="48" y="18" width="28" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="18" y="42" width="28" height="24" fill="#f1f5f9" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="48" y="42" width="28" height="24" fill="#f1f5f9" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="12" y="66" width="72" height="10" fill="#d97706" stroke="#0f172a" stroke-width="3"/>
        `;
        retroInner = `
          <rect x="2" y="2" width="12" height="10" fill="#ffffff"/>
          <rect x="7" y="2" width="2" height="10" fill="#3b82f6"/>
          <rect x="1" y="12" width="14" height="3" fill="#d97706"/>
        `;
        break;

      case 'chair_stack':
        modernInner = `
          <path d="M32 12 V34 H62 M30 34 V56 H64" fill="none" stroke="#2563eb" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="48" y1="56" x2="48" y2="76" stroke="#1e293b" stroke-width="5"/>
          <line x1="28" y1="76" x2="68" y2="76" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
          <circle cx="28" cy="80" r="3" fill="#0f172a"/><circle cx="48" cy="80" r="3" fill="#0f172a"/><circle cx="68" cy="80" r="3" fill="#0f172a"/>
        `;
        retroInner = `
          <rect x="4" y="1" width="2" height="9" fill="#2563eb"/>
          <rect x="4" y="5" width="8" height="2" fill="#2563eb"/>
          <rect x="4" y="9" width="8" height="2" fill="#2563eb"/>
          <rect x="7" y="11" width="2" height="3" fill="#1e293b"/>
          <rect x="4" y="14" width="8" height="1" fill="#0f172a"/>
        `;
        break;

      case 'bookcase':
        modernInner = `
          <rect x="20" y="10" width="56" height="72" rx="3" fill="#78350f" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="25" y="15" width="46" height="18" fill="#451a03"/>
          <rect x="27" y="17" width="7" height="16" fill="#ef4444"/><rect x="35" y="19" width="7" height="14" fill="#facc15"/><rect x="43" y="16" width="8" height="17" fill="#3b82f6"/>
          <rect x="25" y="38" width="46" height="18" fill="#451a03"/>
          <rect x="30" y="40" width="8" height="16" fill="#22c55e"/><rect x="40" y="41" width="7" height="15" fill="#ec4899"/><rect x="50" y="39" width="8" height="17" fill="#38bdf8"/>
          <rect x="25" y="61" width="46" height="16" fill="#451a03"/>
          <rect x="28" y="63" width="9" height="14" fill="#f97316"/><rect x="39" y="63" width="9" height="14" fill="#a855f7"/>
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="14" fill="#78350f"/>
          <rect x="4" y="2" width="2" height="4" fill="#ef4444"/>
          <rect x="6" y="2" width="2" height="4" fill="#facc15"/>
          <rect x="4" y="8" width="2" height="4" fill="#22c55e"/>
          <rect x="7" y="8" width="3" height="4" fill="#3b82f6"/>
        `;
        break;

      case 'moon_rock':
      case 'tiny_moon':
      case 'bigger_moon':
        modernInner = `
          <circle cx="48" cy="48" r="${id === 'bigger_moon' ? 35 : (id === 'tiny_moon' ? 25 : 29)}" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="36" cy="38" r="6" fill="#64748b" stroke="#475569" stroke-width="2"/>
          <circle cx="58" cy="44" r="8" fill="#64748b" stroke="#475569" stroke-width="2"/>
          <circle cx="44" cy="60" r="5" fill="#64748b" stroke="#475569" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="3" y="3" width="10" height="10" fill="${c1}"/>
          <rect x="5" y="5" width="2" height="2" fill="#475569"/>
          <rect x="9" y="7" width="3" height="3" fill="#475569"/>
        `;
        break;

      case 'bowling_ball_bag':
        modernInner = `
          <path d="M32 32 V18 C32 12 64 12 64 18 V32" fill="none" stroke="#f43f5e" stroke-width="5"/>
          <circle cx="38" cy="30" r="11" fill="#1e1b4b" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="58" cy="30" r="11" fill="#312e81" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M16 34 H80 L74 76 H22 Z" fill="#1e1b4b" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="18" y="48" width="60" height="8" fill="#f43f5e"/>
        `;
        retroInner = `
          <rect x="5" y="2" width="6" height="3" fill="#f43f5e"/>
          <rect x="2" y="5" width="12" height="9" fill="#1e1b4b"/>
          <rect x="2" y="8" width="12" height="2" fill="#f43f5e"/>
        `;
        break;

      case 'gold_chest':
        modernInner = `
          <path d="M16 40 C16 22 80 22 80 40 Z" fill="#854d0e" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="36" cy="40" r="6" fill="#facc15"/><circle cx="48" cy="38" r="7" fill="#fde047"/><circle cx="60" cy="40" r="6" fill="#eab308"/>
          <rect x="16" y="42" width="64" height="36" rx="4" fill="#713f12" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="42" y="38" width="12" height="14" rx="2" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
        `;
        retroInner = `
          <rect x="2" y="3" width="12" height="4" fill="#854d0e"/>
          <rect x="3" y="7" width="10" height="2" fill="#facc15"/>
          <rect x="2" y="9" width="12" height="6" fill="#713f12"/>
        `;
        break;

      case 'spring_mattress':
        modernInner = `
          <rect x="12" y="30" width="72" height="34" rx="6" fill="#3b82f6" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="16" y="34" width="64" height="12" rx="3" fill="#f8fafc"/>
          <path d="M22 50 L26 60 L30 50 L34 60 M44 50 L48 60 L52 50 L56 60 M64 50 L68 60 L72 50" fill="none" stroke="#fde047" stroke-width="3" stroke-linejoin="round"/>
        `;
        retroInner = `
          <rect x="1" y="4" width="14" height="8" fill="#3b82f6"/>
          <rect x="2" y="5" width="12" height="3" fill="#ffffff"/>
          <rect x="3" y="9" width="10" height="2" fill="#fde047"/>
        `;
        break;

      case 'glitch_cartridge':
        modernInner = `
          <path d="M24 12 H72 V72 H64 V82 H32 V72 H24 Z" fill="#6d28d9" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="32" y="22" width="32" height="34" rx="2" fill="#22d3ee" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="36" y1="72" x2="36" y2="82" stroke="#facc15" stroke-width="3"/>
          <line x1="44" y1="72" x2="44" y2="82" stroke="#facc15" stroke-width="3"/>
          <line x1="52" y1="72" x2="52" y2="82" stroke="#facc15" stroke-width="3"/>
          <line x1="60" y1="72" x2="60" y2="82" stroke="#facc15" stroke-width="3"/>
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="11" fill="#6d28d9"/>
          <rect x="5" y="3" width="6" height="6" fill="#22d3ee"/>
          <rect x="4" y="12" width="8" height="3" fill="#facc15"/>
        `;
        break;

      case 'tax_audit':
      case 'technical_debt':
      case 'extended_warranty':
      case 'unpaid_invoice':
        suppressBadge = false;
        modernInner = `
          <rect x="22" y="12" width="52" height="70" rx="4" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="28" y="18" width="40" height="11" rx="2" fill="${c3}"/>
          <line x1="28" y1="36" x2="68" y2="36" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
          <line x1="28" y1="64" x2="54" y2="64" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
          <circle cx="60" cy="68" r="7" fill="${c2}" stroke="#0f172a" stroke-width="2"/>
        `;
        retroInner = `
          <rect x="3" y="1" width="10" height="14" fill="${c1}"/>
          <rect x="4" y="2" width="8" height="3" fill="${c3}"/>
          <rect x="4" y="7" width="8" height="1" fill="#64748b"/>
          <rect x="4" y="10" width="6" height="1" fill="#64748b"/>
          <rect x="9" y="11" width="3" height="3" fill="${c2}"/>
        `;
        break;

      case 'internet_comment_section':
        modernInner = `
          <rect x="14" y="18" width="68" height="54" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="14" y="18" width="68" height="12" rx="4" fill="#dc2626" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="20" y="36" width="38" height="12" rx="4" fill="#facc15"/>
          <rect x="36" y="52" width="38" height="12" rx="4" fill="#ef4444"/>
          <text x="39" y="45" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="9" fill="#0f172a">@#$%!</text>
          <text x="55" y="61" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="9" fill="#ffffff">NO U!!</text>
        `;
        retroInner = `
          <rect x="2" y="2" width="12" height="11" fill="#1e293b"/>
          <rect x="2" y="2" width="12" height="2" fill="#dc2626"/>
          <rect x="3" y="5" width="7" height="3" fill="#facc15"/>
          <rect x="6" y="9" width="7" height="3" fill="#ef4444"/>
        `;
        break;

      case 'quantum_watermelon':
        modernInner = `
          <ellipse cx="48" cy="48" rx="38" ry="14" transform="rotate(-30 48 48)" fill="none" stroke="#22d3ee" stroke-width="3"/>
          <ellipse cx="48" cy="48" rx="38" ry="14" transform="rotate(30 48 48)" fill="none" stroke="#ec4899" stroke-width="3"/>
          <circle cx="48" cy="48" r="24" fill="#06b6d4" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M28 50 A20 20 0 0 0 68 50 Z" fill="#ec4899"/>
          <circle cx="40" cy="57" r="2" fill="#0f172a"/><circle cx="48" cy="60" r="2" fill="#0f172a"/><circle cx="56" cy="57" r="2" fill="#0f172a"/>
        `;
        retroInner = `
          <rect x="1" y="7" width="14" height="2" fill="#22d3ee"/>
          <rect x="4" y="4" width="8" height="8" fill="#06b6d4"/>
          <rect x="5" y="8" width="6" height="3" fill="#ec4899"/>
        `;
        break;

      case 'crate_of_bricks':
      case 'carton_of_watermelons':
      case 'suspicious_crate':
      case 'mystery_crate':
      case 'mystery_government_box':
      case 'duck_cannon':
        modernInner = `
          ${id === 'crate_of_bricks' ? '<rect x="22" y="14" width="22" height="12" fill="#dc2626" stroke="#0f172a" stroke-width="2.5"/><rect x="48" y="16" width="22" height="12" fill="#ef4444" stroke="#0f172a" stroke-width="2.5"/>' : ''}
          ${id === 'carton_of_watermelons' ? '<circle cx="34" cy="24" r="12" fill="#16a34a" stroke="#0f172a" stroke-width="2.5"/><circle cx="60" cy="24" r="12" fill="#15803d" stroke="#0f172a" stroke-width="2.5"/>' : ''}
          ${id === 'duck_cannon' ? '<rect x="40" y="8" width="16" height="22" rx="3" fill="#334155" stroke="#0f172a" stroke-width="3"/><circle cx="48" cy="10" r="6" fill="#facc15" stroke="#0f172a" stroke-width="2"/>' : ''}
          <rect x="16" y="26" width="64" height="52" rx="4" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
          <line x1="16" y1="26" x2="80" y2="78" stroke="#0f172a" stroke-width="4"/>
          <line x1="80" y1="26" x2="16" y2="78" stroke="#0f172a" stroke-width="4"/>
          <rect x="16" y="26" width="64" height="52" rx="4" fill="none" stroke="#0f172a" stroke-width="3.5"/>
          ${id === 'mystery_government_box' ? '<ellipse cx="48" cy="52" rx="10" ry="13" fill="#84cc16" stroke="#0f172a" stroke-width="2.5"/><ellipse cx="44" cy="50" rx="3" ry="4" fill="#0f172a"/><ellipse cx="52" cy="50" rx="3" ry="4" fill="#0f172a"/>' : ''}
        `;
        retroInner = `
          <rect x="2" y="3" width="12" height="11" fill="${c1}"/>
          <rect x="3" y="4" width="10" height="2" fill="${c2}"/>
          <rect x="3" y="11" width="10" height="2" fill="${c2}"/>
          <rect x="6" y="7" width="4" height="3" fill="${c3}"/>
        `;
        break;

      case 'portal_cube':
        modernInner = `
          <rect x="18" y="18" width="60" height="60" rx="8" fill="#cbd5e1" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="16" y="16" width="16" height="16" rx="3" fill="#94a3b8" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="64" y="16" width="16" height="16" rx="3" fill="#94a3b8" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="16" y="64" width="16" height="16" rx="3" fill="#94a3b8" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="64" y="64" width="16" height="16" rx="3" fill="#94a3b8" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="48" cy="48" r="14" fill="#0284c7" stroke="#f97316" stroke-width="4"/>
        `;
        retroInner = `
          <rect x="2" y="2" width="12" height="12" fill="#cbd5e1"/>
          <rect x="5" y="5" width="6" height="6" fill="#0284c7"/>
          <rect x="6" y="6" width="4" height="4" fill="#f97316"/>
        `;
        break;

      default:
        suppressBadge = false;
        switch (shape) {
          case 'round':
            modernInner = `
              <circle cx="48" cy="48" r="31" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
              <circle cx="48" cy="48" r="21" fill="${c2}" opacity="0.45"/>
              <ellipse cx="36" cy="34" rx="8" ry="4.5" transform="rotate(-25 36 34)" fill="rgba(255,255,255,0.55)"/>
              <circle cx="58" cy="56" r="5" fill="${c3}"/>
            `;
            retroInner = `
              <rect x="4" y="2" width="8" height="12" fill="${c1}"/>
              <rect x="2" y="4" width="12" height="8" fill="${c1}"/>
              <rect x="4" y="4" width="8" height="8" fill="${c2}"/>
              <rect x="5" y="4" width="2" height="2" fill="#ffffff"/>
              <rect x="9" y="9" width="2" height="2" fill="${c3}"/>
            `;
            break;

          case 'tall':
            modernInner = `
              <rect x="24" y="12" width="48" height="68" rx="6" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
              <rect x="29" y="18" width="38" height="24" rx="3" fill="${c2}" stroke="#0f172a" stroke-width="2"/>
              <rect x="29" y="47" width="38" height="26" rx="3" fill="${c2}" opacity="0.7" stroke="#0f172a" stroke-width="2"/>
              <circle cx="61" cy="30" r="3" fill="${c3}"/>
              <circle cx="61" cy="58" r="3" fill="${c3}"/>
            `;
            retroInner = `
              <rect x="4" y="1" width="8" height="14" fill="${c1}"/>
              <rect x="5" y="2" width="6" height="5" fill="${c2}"/>
              <rect x="5" y="8" width="6" height="6" fill="${c2}"/>
              <rect x="10" y="4" width="1" height="2" fill="${c3}"/>
              <rect x="10" y="10" width="1" height="2" fill="${c3}"/>
            `;
            break;

          case 'monitor':
            modernInner = `
              <rect x="16" y="18" width="64" height="50" rx="7" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
              <rect x="22" y="24" width="44" height="36" rx="4" fill="${c2}" stroke="#0f172a" stroke-width="2.5"/>
              <path d="M26 28 L38 28 L28 42 Z" fill="rgba(255,255,255,0.45)"/>
              <circle cx="72" cy="34" r="3.5" fill="${c3}"/>
              <circle cx="72" cy="46" r="3.5" fill="#facc15"/>
              <rect x="34" y="68" width="28" height="8" rx="2" fill="#334155" stroke="#0f172a" stroke-width="2.5"/>
              <rect x="24" y="76" width="48" height="5" rx="2" fill="#1e293b"/>
            `;
            retroInner = `
              <rect x="2" y="2" width="12" height="10" fill="${c1}"/>
              <rect x="3" y="3" width="8" height="8" fill="${c2}"/>
              <rect x="4" y="4" width="2" height="2" fill="#ffffff"/>
              <rect x="12" y="4" width="1" height="2" fill="${c3}"/>
              <rect x="5" y="12" width="6" height="2" fill="#475569"/>
              <rect x="3" y="14" width="10" height="1" fill="#94a3b8"/>
            `;
            break;

          case 'cake':
            modernInner = `
              <rect x="18" y="52" width="60" height="26" rx="5" fill="${c1}" stroke="#0f172a" stroke-width="3"/>
              <rect x="26" y="32" width="44" height="22" rx="4" fill="${c2}" stroke="#0f172a" stroke-width="3"/>
              <path d="M18 56 Q26 64 34 56 T50 56 T66 56 T78 56" stroke="${c3}" stroke-width="4" fill="none"/>
              <rect x="45" y="16" width="6" height="16" fill="#fef08a" stroke="#0f172a" stroke-width="2"/>
              <circle cx="48" cy="12" r="5" fill="#f97316"/>
            `;
            retroInner = `
              <rect x="7" y="1" width="2" height="2" fill="#f97316"/>
              <rect x="7" y="3" width="2" height="3" fill="#fef08a"/>
              <rect x="4" y="6" width="8" height="4" fill="${c2}"/>
              <rect x="2" y="10" width="12" height="5" fill="${c1}"/>
              <rect x="2" y="10" width="12" height="1" fill="${c3}"/>
            `;
            break;

          case 'doc':
            modernInner = `
              <rect x="22" y="12" width="52" height="70" rx="4" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
              <rect x="28" y="20" width="40" height="12" rx="2" fill="${c3}"/>
              <line x1="28" y1="42" x2="68" y2="42" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
              <line x1="28" y1="52" x2="64" y2="52" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
              <line x1="28" y1="62" x2="56" y2="62" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
              <circle cx="58" cy="66" r="8" fill="${c2}" stroke="#0f172a" stroke-width="2"/>
            `;
            retroInner = `
              <rect x="3" y="1" width="10" height="14" fill="${c1}"/>
              <rect x="4" y="2" width="8" height="3" fill="${c3}"/>
              <rect x="4" y="7" width="8" height="1" fill="#0f172a"/>
              <rect x="4" y="9" width="7" height="1" fill="#0f172a"/>
              <rect x="4" y="11" width="5" height="1" fill="#0f172a"/>
              <rect x="9" y="11" width="3" height="3" fill="${c2}"/>
            `;
            break;

          case 'duck':
            modernInner = `
              <path d="M20 56 C20 42 34 42 44 45 C56 45 74 44 76 58 C77 71 65 78 48 78 C29 78 20 69 20 56 Z" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
              <circle cx="58" cy="33" r="16" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
              <path d="M70 31 L86 35 L71 41 Z" fill="${c3}" stroke="#0f172a" stroke-width="2.5"/>
              ${id === 'rubber_duck_emperor' ? '<polygon points="46,18 52,8 58,16 64,8 70,18" fill="#eab308" stroke="#0f172a" stroke-width="2"/>' : ''}
              <circle cx="63" cy="30" r="3.2" fill="#0f172a"/>
            `;
            retroInner = `
              ${id === 'rubber_duck_emperor' ? '<rect x="7" y="1" width="5" height="2" fill="#eab308"/>' : ''}
              <rect x="8" y="3" width="4" height="4" fill="${c1}"/>
              <rect x="12" y="5" width="3" height="2" fill="${c3}"/>
              <rect x="10" y="4" width="1" height="1" fill="#0f172a"/>
              <rect x="3" y="7" width="10" height="6" fill="${c1}"/>
              <rect x="5" y="9" width="4" height="2" fill="${c2}"/>
            `;
            break;

          case 'thing':
            modernInner = `
              <polygon points="48,8 61,28 84,22 72,44 88,62 64,66 58,86 42,70 18,78 26,54 10,36 33,32" fill="${c1}" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
              <circle cx="48" cy="48" r="18" fill="${c2}" stroke="#0f172a" stroke-width="3"/>
              <circle cx="42" cy="45" r="4" fill="#0f172a"/>
              <circle cx="55" cy="45" r="4" fill="#0f172a"/>
              <path d="M40 55 Q48 62 56 55" stroke="${c3}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            `;
            retroInner = `
              <rect x="6" y="1" width="4" height="14" fill="${c1}"/>
              <rect x="1" y="6" width="14" height="4" fill="${c1}"/>
              <rect x="3" y="3" width="10" height="10" fill="${c1}"/>
              <rect x="5" y="5" width="6" height="6" fill="${c2}"/>
              <rect x="6" y="6" width="1" height="2" fill="#0f172a"/>
              <rect x="9" y="6" width="1" height="2" fill="#0f172a"/>
              <rect x="6" y="9" width="4" height="1" fill="${c3}"/>
            `;
            break;

          default:
            modernInner = `
              <rect x="16" y="20" width="64" height="58" rx="8" fill="${c1}" stroke="#0f172a" stroke-width="3.5"/>
              <rect x="23" y="27" width="50" height="44" rx="5" fill="${c2}" opacity="0.32" stroke="#0f172a" stroke-width="2"/>
              <circle cx="26" cy="30" r="3" fill="${c3}"/>
              <circle cx="70" cy="30" r="3" fill="${c3}"/>
              <circle cx="26" cy="68" r="3" fill="${c3}"/>
              <circle cx="70" cy="68" r="3" fill="${c3}"/>
              <circle cx="48" cy="49" r="14" fill="${c2}" stroke="#0f172a" stroke-width="2.5"/>
              <circle cx="48" cy="49" r="5" fill="${c3}"/>
            `;
            retroInner = `
              <rect x="2" y="2" width="12" height="12" fill="${c1}"/>
              <rect x="3" y="3" width="10" height="10" fill="${c2}"/>
              <rect x="4" y="4" width="8" height="8" fill="${c1}"/>
              <rect x="6" y="6" width="4" height="4" fill="${c3}"/>
              <rect x="3" y="3" width="1" height="1" fill="#ffffff"/>
            `;
            break;
        }
        break;
    }

    const labelOverlay = (!suppressBadge && label)
      ? `<text x="48" y="54" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="14" fill="#ffffff" stroke="#0f172a" stroke-width="3" paint-order="stroke">${label}</text>`
      : '';

    const modernSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
      <ellipse cx="48" cy="85" rx="28" ry="4.5" fill="rgba(15,23,42,0.18)"/>
      ${modernInner}
      ${labelOverlay}
    </svg>`;

    const retroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
      ${retroInner}
    </svg>`;

    return { modernSvg, retroSvg };
  }

  /**
   * Raw Catalog Definitions for all 108 Objects:
   * - Original 12
   * - Heavy Stuff (12) + Massive Safe
   * - Food Stuff (12) + Carton of Watermelons
   * - Retro Stuff (12) + Glitch Cartridge
   * - Weird Stuff (12) + Bowling Ball Bag + Crate of Bricks + Mystery Crate
   * - Office Stuff (12)
   * - Ridiculous Stuff (15) + Pirate Gold Chest + Pocket Black Hole + Wormhole Cube + Duck Cannon + Spring Mattress
   * - Legendary Stuff (10)
   */
  const RAW_CATALOG = [
    // === ORIGINAL 12 ===
    {
      id: 'piano', name: 'Grand Piano', shortName: 'Piano', emoji: '🎹',
      weight: 450, fragility: 65, primaryEffect: 'SHATTER', secondaryEffects: ['FLOOR_CRACK'],
      shape: 'box', primaryColor: '#1e293b', secondaryColor: '#f8fafc', accentColor: '#f59e0b', badgeText: '88KEY',
      tagline: '88 keys of pure gravitational regret.'
    },
    {
      id: 'watermelon', name: 'Watermelon', shortName: 'Melon', emoji: '🍉',
      weight: 18, fragility: 22, primaryEffect: 'SPLATTER', secondaryEffects: [],
      shape: 'round', primaryColor: '#16a34a', secondaryColor: '#ef4444', accentColor: '#14532d',
      tagline: 'Picnic ruined in 0.4 seconds flat.'
    },
    {
      id: 'bowling_ball', name: 'Bowling Ball', shortName: 'Bowling', emoji: '🎳',
      weight: 16, fragility: 135, primaryEffect: 'BOUNCE', secondaryEffects: ['FLOOR_CRACK'],
      shape: 'round', primaryColor: '#312e81', secondaryColor: '#6366f1', accentColor: '#0f172a',
      tagline: 'Dense cosmic resin that laughs at your floorboards.'
    },
    {
      id: 'rubber_duck', name: 'Rubber Duck', shortName: 'Duck', emoji: '🦆',
      weight: 0.2, fragility: 999, primaryEffect: 'BOUNCE', secondaryEffects: ['MEGA_BOUNCE'],
      shape: 'duck', primaryColor: '#facc15', secondaryColor: '#eab308', accentColor: '#f97316',
      tagline: 'Indestructible bath-time menace. SQUEAK!'
    },
    {
      id: 'anvil', name: 'Iron Anvil', shortName: 'Anvil', emoji: '⚒️',
      weight: 250, fragility: 110, primaryEffect: 'EXPLODE', secondaryEffects: ['FLOOR_CRACK'],
      shape: 'box', primaryColor: '#475569', secondaryColor: '#94a3b8', accentColor: '#f97316', badgeText: 'ACME',
      tagline: 'ACME-certified gravity accelerator.'
    },
    {
      id: 'glass_bottle', name: 'Glass Bottle', shortName: 'Bottle', emoji: '🍾',
      weight: 1.2, fragility: 15, primaryEffect: 'SHATTER', secondaryEffects: ['FRAGMENT'],
      shape: 'tall', primaryColor: '#10b981', secondaryColor: '#a7f3d0', accentColor: '#f59e0b',
      tagline: 'Structural integrity of a soap bubble.'
    },
    {
      id: 'pumpkin', name: 'Pumpkin', shortName: 'Pumpkin', emoji: '🎃',
      weight: 14, fragility: 25, primaryEffect: 'SPLATTER', secondaryEffects: ['FRAGMENT'],
      shape: 'round', primaryColor: '#f97316', secondaryColor: '#ea580c', accentColor: '#15803d',
      tagline: 'November 1st porch cleanup simulator.'
    },
    {
      id: 'tv', name: 'CRT Television', shortName: 'TV', emoji: '📺',
      weight: 65, fragility: 42, primaryEffect: 'EXPLODE', secondaryEffects: ['SHATTER', 'GLITCH'],
      shape: 'monitor', primaryColor: '#78350f', secondaryColor: '#0ea5e9', accentColor: '#ef4444',
      tagline: 'Nothing good was on channel 4 anyway.'
    },
    {
      id: 'toaster', name: 'Chrome Toaster', shortName: 'Toaster', emoji: '🍞',
      weight: 6, fragility: 35, primaryEffect: 'EXPLODE', secondaryEffects: ['SPRING_LAUNCH'],
      shape: 'box', primaryColor: '#cbd5e1', secondaryColor: '#f59e0b', accentColor: '#ef4444', badgeText: 'TOAST',
      tagline: 'Ejects burnt sourdough at Mach 2 on impact.'
    },
    {
      id: 'brick', name: 'Red Brick', shortName: 'Brick', emoji: '🧱',
      weight: 5, fragility: 48, primaryEffect: 'SHATTER', secondaryEffects: ['FLOOR_CRACK'],
      shape: 'box', primaryColor: '#dc2626', secondaryColor: '#991b1b', accentColor: '#fca5a5',
      tagline: 'Aerodynamic? No. Subtle? Also no.'
    },
    {
      id: 'giant_egg', name: 'Giant Egg', shortName: 'Giant Egg', emoji: '🥚',
      weight: 42, fragility: 18, primaryEffect: 'SPLATTER', secondaryEffects: ['SPAWN_OBJECT'],
      shape: 'round', primaryColor: '#fef3c7', secondaryColor: '#facc15', accentColor: '#f59e0b',
      tagline: 'Ostrich? Dinosaur? Either way, hope you brought toast.'
    },
    {
      id: 'mystery_box', name: 'Mystery Box', shortName: 'Mystery', emoji: '🎁',
      weight: 50, fragility: 28, primaryEffect: 'EXPLODE', secondaryEffects: ['CONFETTI', 'SPAWN_OBJECT'],
      shape: 'box', primaryColor: '#9333ea', secondaryColor: '#facc15', accentColor: '#ec4899', badgeText: '???',
      tagline: 'Could be gold! Could be glitter bombs and rubber ducks!'
    },

    // === HEAVY STUFF ===
    {
      id: 'safe', name: 'Massive Safe', shortName: 'Safe', emoji: '🔐',
      weight: 800, fragility: 70, primaryEffect: 'SHATTER', secondaryEffects: ['GOLD_BURST', 'FLOOR_CRACK'],
      shape: 'box', primaryColor: '#334155', secondaryColor: '#eab308', accentColor: '#facc15', badgeText: 'VAULT',
      tagline: 'Forgot the combo? Gravity knows the combination.'
    },
    {
      id: 'gun_safe', name: 'Gun Safe', shortName: 'Gun Safe', emoji: '🛡️',
      weight: 650, fragility: 85, primaryEffect: 'FLOOR_CRACK', secondaryEffects: ['GOLD_BURST', 'EXPLODE'],
      shape: 'tall', primaryColor: '#1e293b', secondaryColor: '#64748b', accentColor: '#eab308', badgeText: 'SAFE',
      tagline: 'Half a ton of reinforced steel meeting an innocent floor.'
    },
    {
      id: 'refrigerator', name: 'Refrigerator', shortName: 'Fridge', emoji: '🧊',
      weight: 320, fragility: 60, primaryEffect: 'SHATTER', secondaryEffects: ['FLOOR_CRACK', 'RAIN_OF_OBJECTS'],
      shape: 'tall', primaryColor: '#f8fafc', secondaryColor: '#bae6fd', accentColor: '#0284c7', badgeText: 'COLD',
      tagline: 'Is your refrigerator running? No, it is in freefall.'
    },
    {
      id: 'vending_machine', name: 'Vending Machine', shortName: 'Vending', emoji: '🥤',
      weight: 400, fragility: 55, primaryEffect: 'SHATTER', secondaryEffects: ['GOLD_BURST', 'RAIN_OF_OBJECTS', 'FLOOR_CRACK'],
      shape: 'tall', primaryColor: '#dc2626', secondaryColor: '#38bdf8', accentColor: '#facc15', badgeText: 'SNACK',
      tagline: 'That bag of chips stuck on coil B4 is finally free!'
    },
    {
      id: 'bathtub', name: 'Bathtub', shortName: 'Bathtub', emoji: '🛁',
      weight: 280, fragility: 58, primaryEffect: 'SHATTER', secondaryEffects: ['DUCK_STORM', 'FLOOR_CRACK'],
      shape: 'box', primaryColor: '#ffffff', secondaryColor: '#7dd3fc', accentColor: '#facc15', badgeText: 'TUB',
      tagline: 'Cast-iron porcelain packed with emergency bath ducks.'
    },
    {
      id: 'server_rack', name: 'Server Rack', shortName: 'Servers', emoji: '🖥️',
      weight: 520, fragility: 50, primaryEffect: 'EXPLODE', secondaryEffects: ['GLITCH', 'CHAIN_REACTION', 'FLOOR_CRACK'],
      shape: 'tall', primaryColor: '#0f172a', secondaryColor: '#22c55e', accentColor: '#ef4444', badgeText: 'CLOUD',
      tagline: 'The cloud just became the ground.'
    },
    {
      id: 'cement_mixer', name: 'Cement Mixer', shortName: 'Mixer', emoji: '🏗️',
      weight: 750, fragility: 90, primaryEffect: 'EXPLODE', secondaryEffects: ['SPLATTER', 'FLOOR_CRACK'],
      shape: 'round', primaryColor: '#f59e0b', secondaryColor: '#94a3b8', accentColor: '#1e293b', badgeText: 'MIX',
      tagline: 'Pours a brand new floor while destroying the old one.'
    },
    {
      id: 'arcade_cabinet', name: 'Arcade Cabinet', shortName: 'Arcade', emoji: '🕹️',
      weight: 310, fragility: 52, primaryEffect: 'EXPLODE', secondaryEffects: ['GOLD_BURST', 'GLITCH'],
      shape: 'tall', primaryColor: '#4f46e5', secondaryColor: '#ec4899', accentColor: '#facc15', badgeText: '25¢',
      tagline: 'INSERT COIN TO CONTINUE... oh wait, it shattered.'
    },
    {
      id: 'engine_block', name: 'Engine Block', shortName: 'V8 Engine', emoji: '⚙️',
      weight: 480, fragility: 95, primaryEffect: 'EXPLODE', secondaryEffects: ['CHAIN_REACTION', 'FLOOR_CRACK'],
      shape: 'box', primaryColor: '#475569', secondaryColor: '#dc2626', accentColor: '#f97316', badgeText: 'V8',
      tagline: 'Check Engine light is definitely on now.'
    },
    {
      id: 'industrial_fan', name: 'Industrial Fan', shortName: 'Big Fan', emoji: '🌀',
      weight: 140, fragility: 48, primaryEffect: 'ANTI_GRAVITY', secondaryEffects: ['SHATTER', 'RICOCHET'],
      shape: 'round', primaryColor: '#64748b', secondaryColor: '#e2e8f0', accentColor: '#0ea5e9',
      tagline: 'Blows itself upward for a second before losing the argument with gravity.'
    },
    {
      id: 'metal_locker', name: 'Metal Locker', shortName: 'Locker', emoji: '🚪',
      weight: 165, fragility: 62, primaryEffect: 'SHATTER', secondaryEffects: ['SPAWN_OBJECT', 'FLOOR_CRACK'],
      shape: 'tall', primaryColor: '#64748b', secondaryColor: '#94a3b8', accentColor: '#cbd5e1', badgeText: 'GYM',
      tagline: 'Contains a gym sock from 1998 and pure kinetic energy.'
    },
    {
      id: 'manhole_cover', name: 'Manhole Cover', shortName: 'Manhole', emoji: '🕳️',
      weight: 240, fragility: 130, primaryEffect: 'FLOOR_CRACK', secondaryEffects: ['RICOCHET', 'PORTAL'],
      shape: 'round', primaryColor: '#334155', secondaryColor: '#1e293b', accentColor: '#94a3b8',
      tagline: 'Punches a sewer-sized shortcut straight through the floor.'
    },
    {
      id: 'filing_cabinet', name: 'Filing Cabinet', shortName: 'Cabinet', emoji: '🗄️',
      weight: 190, fragility: 54, primaryEffect: 'SHATTER', secondaryEffects: ['FRAGMENT', 'FLOOR_CRACK'],
      shape: 'tall', primaryColor: '#94a3b8', secondaryColor: '#f8fafc', accentColor: '#475569', badgeText: 'A-Z',
      tagline: 'Alphabetized chaos from A to Z.'
    },

    // === FOOD STUFF ===
    {
      id: 'birthday_cake', name: 'Birthday Cake', shortName: 'Bday Cake', emoji: '🎂',
      weight: 8, fragility: 10, primaryEffect: 'SPLATTER', secondaryEffects: ['CONFETTI'],
      shape: 'cake', primaryColor: '#f472b6', secondaryColor: '#fef08a', accentColor: '#38bdf8',
      tagline: 'Make a wish! (Your wish was buttercream shrapnel.)'
    },
    {
      id: 'giant_donut', name: 'Giant Donut', shortName: 'Donut', emoji: '🍩',
      weight: 22, fragility: 20, primaryEffect: 'BOUNCE', secondaryEffects: ['SPLATTER', 'CONFETTI'],
      shape: 'round', primaryColor: '#f59e0b', secondaryColor: '#ec4899', accentColor: '#fde047',
      tagline: 'Sprinkles have achieved escape velocity.'
    },
    {
      id: 'pickle_jar', name: 'Pickle Jar', shortName: 'Pickles', emoji: '🥒',
      weight: 6, fragility: 14, primaryEffect: 'SHATTER', secondaryEffects: ['SPLATTER'],
      shape: 'tall', primaryColor: '#65a30d', secondaryColor: '#bef264', accentColor: '#15803d', badgeText: 'DILL',
      tagline: 'The lid was too tight anyway. Problem solved!'
    },
    {
      id: 'banana_crate', name: 'Banana Crate', shortName: 'Bananas', emoji: '🍌',
      weight: 45, fragility: 26, primaryEffect: 'MULTI_DROP', secondaryEffects: ['SPLATTER', 'RICOCHET'],
      shape: 'box', primaryColor: '#facc15', secondaryColor: '#a16207', accentColor: '#fef08a', badgeText: 'SLIP',
      tagline: 'Potassium cluster-bomb with maximum cartoon slip hazard.'
    },
    {
      id: 'pizza_stack', name: 'Pizza Stack', shortName: 'Pizzas', emoji: '🍕',
      weight: 15, fragility: 16, primaryEffect: 'MULTI_DROP', secondaryEffects: ['SPLATTER'],
      shape: 'box', primaryColor: '#ea580c', secondaryColor: '#facc15', accentColor: '#dc2626', badgeText: 'HOT',
      tagline: '30 minutes or it’s free-falling.'
    },
    {
      id: 'pudding_cup', name: 'Pudding Cup', shortName: 'Pudding', emoji: '🍮',
      weight: 4, fragility: 8, primaryEffect: 'SPLATTER', secondaryEffects: ['MEGA_BOUNCE'],
      shape: 'round', primaryColor: '#d97706', secondaryColor: '#fef3c7', accentColor: '#78350f',
      tagline: 'Jiggles heroically before surrendering to pudding physics.'
    },
    {
      id: 'frozen_turkey', name: 'Frozen Turkey', shortName: 'Turkey', emoji: '🦃',
      weight: 28, fragility: 95, primaryEffect: 'FLOOR_CRACK', secondaryEffects: ['BOUNCE', 'RICOCHET'],
      shape: 'round', primaryColor: '#d97706', secondaryColor: '#bae6fd', accentColor: '#ffffff',
      tagline: 'Harder than a meteorite. Still needs 4 days to thaw.'
    },
    {
      id: 'wedding_cake', name: 'Wedding Cake', shortName: 'Wed Cake', emoji: '👰',
      weight: 65, fragility: 12, primaryEffect: 'SPLATTER', secondaryEffects: ['CONFETTI', 'FRAGMENT'],
      shape: 'cake', primaryColor: '#ffffff', secondaryColor: '#fbcfe8', accentColor: '#f43f5e',
      tagline: 'Seven tiers of fondant tragedy. The DJ just stopped the music.'
    },
    {
      id: 'giant_marshmallow', name: 'Giant Marshmallow', shortName: 'Mallow', emoji: '🍥',
      weight: 19, fragility: 400, primaryEffect: 'MEGA_BOUNCE', secondaryEffects: ['SPRING_LAUNCH'],
      shape: 'tall', primaryColor: '#ffffff', secondaryColor: '#f1f5f9', accentColor: '#f472b6', badgeText: 'PUFF',
      tagline: 'Squishes to 2 inches thick then launches into the stratosphere.'
    },
    {
      id: 'water_cooler_jug', name: 'Water Cooler Jug', shortName: 'Water Jug', emoji: '🚰',
      weight: 42, fragility: 34, primaryEffect: 'SPLATTER', secondaryEffects: ['BOUNCE', 'SHATTER'],
      shape: 'tall', primaryColor: '#38bdf8', secondaryColor: '#bae6fd', accentColor: '#0284c7', badgeText: '5GAL',
      tagline: 'GLUG-GLUG-GLUG-SPLASH!'
    },
    {
      id: 'taco_box', name: 'Taco Box', shortName: 'Tacos', emoji: '🌮',
      weight: 9, fragility: 14, primaryEffect: 'MULTI_DROP', secondaryEffects: ['SPLATTER', 'FRAGMENT'],
      shape: 'box', primaryColor: '#f59e0b', secondaryColor: '#ef4444', accentColor: '#22c55e', badgeText: '12PK',
      tagline: 'Hard shells shatter, guac splatters—it’s Taco Doomsday.'
    },
    {
      id: 'spaghetti_pot', name: 'Spaghetti Pot', shortName: 'Spaghetti', emoji: '🍝',
      weight: 24, fragility: 20, primaryEffect: 'SPLATTER', secondaryEffects: ['RICOCHET'],
      shape: 'round', primaryColor: '#dc2626', secondaryColor: '#facc15', accentColor: '#94a3b8',
      tagline: 'Mom’s marinara is now permanently bonded to the wallpaper.'
    },

    // === RETRO STUFF ===
    {
      id: 'apple_ii', name: 'Apple II', shortName: 'Apple II', emoji: '🍏',
      weight: 26, fragility: 38, primaryEffect: 'SHATTER', secondaryEffects: ['GLITCH', 'FRAGMENT'],
      shape: 'monitor', primaryColor: '#d6d3d1', secondaryColor: '#22c55e', accentColor: '#f59e0b', badgeText: '64KB',
      tagline: 'SYNTAX ERROR IN LINE GRAVITY.'
    },
    {
      id: 'commodore_64', name: 'Commodore 64', shortName: 'C64', emoji: '⌨️',
      weight: 22, fragility: 36, primaryEffect: 'SHATTER', secondaryEffects: ['GLITCH', 'CONFETTI'],
      shape: 'monitor', primaryColor: '#a8a29e', secondaryColor: '#3b82f6', accentColor: '#ef4444', badgeText: 'C64',
      tagline: 'LOAD "CHAOS",8,1 — READY. RUN.'
    },
    {
      id: 'floppy_disk_box', name: 'Floppy Disk Box', shortName: 'Floppies', emoji: '💾',
      weight: 7, fragility: 22, primaryEffect: 'MULTI_DROP', secondaryEffects: ['FRAGMENT', 'GLITCH'],
      shape: 'box', primaryColor: '#2563eb', secondaryColor: '#e2e8f0', accentColor: '#facc15', badgeText: '1.44M',
      tagline: '1.44 Megabytes of flying plastic shurikens.'
    },
    {
      id: 'dot_matrix_printer', name: 'Dot Matrix Printer', shortName: 'DotMatrix', emoji: '🖨️',
      weight: 38, fragility: 32, primaryEffect: 'SHATTER', secondaryEffects: ['CONFETTI', 'FRAGMENT'],
      shape: 'box', primaryColor: '#e7e5e4', secondaryColor: '#f8fafc', accentColor: '#16a34a', badgeText: 'BZZT',
      tagline: 'BZZZZZT-SCREEEEE-CRUNCH! Tractor-feed paper ribbons everywhere.'
    },
    {
      id: 'crt_monitor', name: 'CRT Monitor', shortName: 'CRT', emoji: '🖥️',
      weight: 58, fragility: 35, primaryEffect: 'EXPLODE', secondaryEffects: ['GLITCH', 'FLOOR_CRACK'],
      shape: 'monitor', primaryColor: '#cbd5e1', secondaryColor: '#33ff33', accentColor: '#0ea5e9',
      tagline: 'Degauss button pressed at 9.8 meters per second squared.'
    },
    {
      id: 'vcr', name: 'VCR', shortName: 'VCR', emoji: '📼',
      weight: 18, fragility: 30, primaryEffect: 'SHATTER', secondaryEffects: ['FRAGMENT', 'GLITCH'],
      shape: 'box', primaryColor: '#1e293b', secondaryColor: '#ef4444', accentColor: '#cbd5e1', badgeText: '12:00',
      tagline: 'Stopped blinking 12:00 forever. Be kind, please rewind the debris.'
    },
    {
      id: 'boom_box', name: 'Boom Box', shortName: 'Boom Box', emoji: '📻',
      weight: 29, fragility: 40, primaryEffect: 'EXPLODE', secondaryEffects: ['MEGA_BOUNCE', 'SHATTER'],
      shape: 'box', primaryColor: '#334155', secondaryColor: '#38bdf8', accentColor: '#facc15', badgeText: 'BASS',
      tagline: 'Literal bass drop.'
    },
    {
      id: 'dial_telephone', name: 'Dial Telephone', shortName: 'Phone', emoji: '☎️',
      weight: 11, fragility: 44, primaryEffect: 'SHATTER', secondaryEffects: ['RICOCHET'],
      shape: 'round', primaryColor: '#dc2626', secondaryColor: '#f8fafc', accentColor: '#0f172a',
      tagline: 'RING-RING-SMASH! Wrong number, pal.'
    },
    {
      id: 'fax_machine', name: 'Fax Machine', shortName: 'Fax', emoji: '📠',
      weight: 27, fragility: 28, primaryEffect: 'EXPLODE', secondaryEffects: ['FRAGMENT', 'CONFETTI'],
      shape: 'box', primaryColor: '#d6d3d1', secondaryColor: '#ffffff', accentColor: '#ef4444', badgeText: 'FAX',
      tagline: 'Office Space tribute act. PC Load Letter THIS.'
    },
    {
      id: 'typewriter', name: 'Typewriter', shortName: 'Typewriter', emoji: '📝',
      weight: 34, fragility: 46, primaryEffect: 'SHATTER', secondaryEffects: ['FRAGMENT', 'FLOOR_CRACK'],
      shape: 'box', primaryColor: '#0f172a', secondaryColor: '#e2e8f0', accentColor: '#f59e0b', badgeText: 'DING!',
      tagline: 'CLACK-CLACK-CLACK-DING-CRASH!'
    },
    {
      id: 'palm_pilot', name: 'Palm Pilot', shortName: 'PalmPilot', emoji: '📱',
      weight: 3, fragility: 18, primaryEffect: 'GLITCH', secondaryEffects: ['SHATTER'],
      shape: 'tall', primaryColor: '#475569', secondaryColor: '#84cc16', accentColor: '#38bdf8', badgeText: 'PDA',
      tagline: 'Your 1999 dentist appointment has been permanently canceled.'
    },
    {
      id: 'cassette_collection', name: 'Cassette Collection', shortName: 'Cassettes', emoji: '🎞️',
      weight: 16, fragility: 24, primaryEffect: 'MULTI_DROP', secondaryEffects: ['SHATTER', 'CONFETTI'],
      shape: 'box', primaryColor: '#7c3aed', secondaryColor: '#f59e0b', accentColor: '#ec4899', badgeText: 'MIX',
      tagline: 'miles of tangled magnetic tape ribboning across the room.'
    },

    // === WEIRD STUFF ===
    {
      id: 'garden_gnome', name: 'Garden Gnome', shortName: 'Gnome', emoji: '🧙',
      weight: 12, fragility: 19, primaryEffect: 'SHATTER', secondaryEffects: ['SPAWN_OBJECT'],
      shape: 'tall', primaryColor: '#dc2626', secondaryColor: '#2563eb', accentColor: '#fef08a', badgeText: 'GNOME',
      tagline: 'Hollow ceramic attitude problem meets solid concrete.'
    },
    {
      id: 'inflatable_flamingo', name: 'Inflatable Flamingo', shortName: 'Flamingo', emoji: '🦩',
      weight: 1, fragility: 850, primaryEffect: 'MEGA_BOUNCE', secondaryEffects: ['ANTI_GRAVITY', 'RICOCHET'],
      shape: 'duck', primaryColor: '#ec4899', secondaryColor: '#f472b6', accentColor: '#fbcfe8',
      tagline: 'Refuses to fall normal speed. Bounces like caffeinated vinyl.'
    },
    {
      id: 'bean_bag_chair', name: 'Bean Bag Chair', shortName: 'Bean Bag', emoji: '🛋️',
      weight: 20, fragility: 30, primaryEffect: 'EXPLODE', secondaryEffects: ['CONFETTI', 'FRAGMENT'],
      shape: 'round', primaryColor: '#8b5cf6', secondaryColor: '#f8fafc', accentColor: '#facc15',
      tagline: 'Ten million static-charged styrofoam beads now own your house.'
    },
    {
      id: 'disco_ball', name: 'Disco Ball', shortName: 'Disco Ball', emoji: '🪩',
      weight: 25, fragility: 22, primaryEffect: 'SHATTER', secondaryEffects: ['CONFETTI', 'FRAGMENT'],
      shape: 'round', primaryColor: '#e2e8f0', secondaryColor: '#38bdf8', accentColor: '#facc15',
      tagline: 'Panic at the Disco (because the mirror ball just detached).'
    },
    {
      id: 'traffic_cone', name: 'Traffic Cone', shortName: 'Cone', emoji: '🚧',
      weight: 7, fragility: 500, primaryEffect: 'SPRING_LAUNCH', secondaryEffects: ['MEGA_BOUNCE', 'RICOCHET'],
      shape: 'tall', primaryColor: '#f97316', secondaryColor: '#ffffff', accentColor: '#ea580c', badgeText: 'CONE',
      tagline: 'OSHA did not approve this trajectory.'
    },
    {
      id: 'lava_lamp', name: 'Lava Lamp', shortName: 'Lava Lamp', emoji: '🧪',
      weight: 9, fragility: 15, primaryEffect: 'SPLATTER', secondaryEffects: ['SHATTER'],
      shape: 'tall', primaryColor: '#ec4899', secondaryColor: '#a855f7', accentColor: '#facc15', badgeText: 'GROOVY',
      tagline: 'Groovy psychedelic wax blobs splattered in 4K.'
    },
    {
      id: 'shopping_cart', name: 'Shopping Cart', shortName: 'Cart', emoji: '🛒',
      weight: 55, fragility: 75, primaryEffect: 'RICOCHET', secondaryEffects: ['BOUNCE', 'SHATTER'],
      shape: 'box', primaryColor: '#94a3b8', secondaryColor: '#ef4444', accentColor: '#cbd5e1', badgeText: 'CART',
      tagline: 'Always has one squeaky wheel that veers hard left at 60 mph.'
    },
    {
      id: 'mailbox', name: 'Mailbox', shortName: 'Mailbox', emoji: '📫',
      weight: 42, fragility: 50, primaryEffect: 'SHATTER', secondaryEffects: ['SPAWN_OBJECT', 'CONFETTI'],
      shape: 'tall', primaryColor: '#1d4ed8', secondaryColor: '#ef4444', accentColor: '#f8fafc', badgeText: 'MAIL',
      tagline: 'You’ve got mail! And sheet metal shrapnel!'
    },
    {
      id: 'pinata', name: 'Piñata', shortName: 'Piñata', emoji: '🪅',
      weight: 14, fragility: 12, primaryEffect: 'CONFETTI', secondaryEffects: ['SPAWN_OBJECT', 'GOLD_BURST', 'RAIN_OF_OBJECTS'],
      shape: 'duck', primaryColor: '#ec4899', secondaryColor: '#facc15', accentColor: '#38bdf8',
      tagline: 'No stick required! Gravity is the ultimate blindfolded kid.'
    },
    {
      id: 'trampoline', name: 'Trampoline', shortName: 'Trampoline', emoji: '🤸',
      weight: 85, fragility: 600, primaryEffect: 'SPRING_LAUNCH', secondaryEffects: ['MEGA_BOUNCE', 'RICOCHET'],
      shape: 'round', primaryColor: '#1e293b', secondaryColor: '#3b82f6', accentColor: '#cbd5e1',
      tagline: 'Wait—if you drop a trampoline, does the floor bounce or the trampoline?!'
    },
    {
      id: 'dumpster', name: 'Dumpster', shortName: 'Dumpster', emoji: '🗑️',
      weight: 900, fragility: 80, primaryEffect: 'EXPLODE', secondaryEffects: ['RAIN_OF_OBJECTS', 'FLOOR_CRACK', 'SPAWN_OBJECT'],
      shape: 'box', primaryColor: '#15803d', secondaryColor: '#1e293b', accentColor: '#f97316', badgeText: 'TRASH',
      tagline: 'Certified Dumpster Fire (now with 100% more terminal velocity).'
    },
    {
      id: 'kayak', name: 'Kayak', shortName: 'Kayak', emoji: '🛶',
      weight: 48, fragility: 120, primaryEffect: 'RICOCHET', secondaryEffects: ['MEGA_BOUNCE'],
      shape: 'tall', primaryColor: '#eab308', secondaryColor: '#0ea5e9', accentColor: '#0f172a', badgeText: 'KAYAK',
      tagline: 'Whitewater rapids? No, dry-land vertical concrete rapids.'
    },

    // === OFFICE STUFF ===
    {
      id: 'coffee_machine', name: 'Coffee Machine', shortName: 'Espresso', emoji: '☕',
      weight: 28, fragility: 26, primaryEffect: 'EXPLODE', secondaryEffects: ['SPLATTER', 'SHATTER'],
      shape: 'tall', primaryColor: '#1e293b', secondaryColor: '#78350f', accentColor: '#ef4444', badgeText: 'BREW',
      tagline: 'Decaf is no longer an option. High-pressure espresso detonation!'
    },
    {
      id: 'conference_table', name: 'Conference Table', shortName: 'Conf Table', emoji: '🪑',
      weight: 380, fragility: 64, primaryEffect: 'SHATTER', secondaryEffects: ['FLOOR_CRACK', 'FRAGMENT'],
      shape: 'box', primaryColor: '#78350f', secondaryColor: '#b45309', accentColor: '#f59e0b', badgeText: 'MEET',
      tagline: 'This meeting could have been an email—or a crater.'
    },
    {
      id: 'network_switch', name: 'Network Switch', shortName: 'Switch', emoji: '🔌',
      weight: 19, fragility: 34, primaryEffect: 'GLITCH', secondaryEffects: ['EXPLODE', 'SHATTER'],
      shape: 'box', primaryColor: '#0284c7', secondaryColor: '#22c55e', accentColor: '#facc15', badgeText: '48PORT',
      tagline: '100% packet loss achieved.'
    },
    {
      id: 'laser_printer', name: 'Laser Printer', shortName: 'Printer', emoji: '🖨️',
      weight: 62, fragility: 36, primaryEffect: 'EXPLODE', secondaryEffects: ['SPLATTER', 'CONFETTI'],
      shape: 'box', primaryColor: '#e2e8f0', secondaryColor: '#0f172a', accentColor: '#ec4899', badgeText: 'TONER',
      tagline: 'Cyan, Magenta, Yellow, and Key-Black toner cloud of doom!'
    },
    {
      id: 'document_shredder', name: 'Document Shredder', shortName: 'Shredder', emoji: '📄',
      weight: 36, fragility: 40, primaryEffect: 'CONFETTI', secondaryEffects: ['SHATTER', 'FRAGMENT'],
      shape: 'tall', primaryColor: '#334155', secondaryColor: '#ffffff', accentColor: '#ef4444', badgeText: 'SHRED',
      tagline: 'Shreds itself into ten thousand festive paper strips.'
    },
    {
      id: 'whiteboard', name: 'Whiteboard', shortName: 'Whiteboard', emoji: '📋',
      weight: 44, fragility: 32, primaryEffect: 'SHATTER', secondaryEffects: ['RICOCHET'],
      shape: 'box', primaryColor: '#f8fafc', secondaryColor: '#cbd5e1', accentColor: '#ef4444', badgeText: 'Q4KPI',
      tagline: 'DO NOT ERASE—oh, never mind, it’s in 40 pieces.'
    },
    {
      id: 'cubicle_divider', name: 'Cubicle Divider', shortName: 'Cubicle', emoji: '🧱',
      weight: 68, fragility: 52, primaryEffect: 'SHATTER', secondaryEffects: ['BOUNCE', 'FRAGMENT'],
      shape: 'tall', primaryColor: '#64748b', secondaryColor: '#94a3b8', accentColor: '#cbd5e1', badgeText: 'CUBE',
      tagline: 'Open-plan office renovation completed in 0.8 seconds.'
    },
    {
      id: 'office_fridge', name: 'Office Fridge', shortName: 'BreakFridge', emoji: 'お弁当',
      weight: 185, fragility: 56, primaryEffect: 'SPLATTER', secondaryEffects: ['RAIN_OF_OBJECTS', 'FLOOR_CRACK'],
      shape: 'tall', primaryColor: '#e2e8f0', secondaryColor: '#84cc16', accentColor: '#16a34a', badgeText: 'LUNCH',
      tagline: 'Whoever stole Kevin’s labeled yogurt now has bigger problems.'
    },
    {
      id: 'punch_clock', name: 'Punch Clock', shortName: 'PunchClock', emoji: '⏰',
      weight: 26, fragility: 45, primaryEffect: 'SPRING_LAUNCH', secondaryEffects: ['SHATTER', 'GOLD_BURST'],
      shape: 'round', primaryColor: '#475569', secondaryColor: '#f8fafc', accentColor: '#dc2626',
      tagline: 'You just clocked out with extreme prejudice.'
    },
    {
      id: 'paper_pallet', name: 'Paper Pallet', shortName: 'Paper', emoji: '📚',
      weight: 550, fragility: 62, primaryEffect: 'CONFETTI', secondaryEffects: ['FLOOR_CRACK', 'RAIN_OF_OBJECTS'],
      shape: 'box', primaryColor: '#ffffff', secondaryColor: '#d97706', accentColor: '#3b82f6', badgeText: '50REAM',
      tagline: '25,000 sheets of A4 copy paper achieving simultaneous liftoff.'
    },
    {
      id: 'chair_stack', name: 'Chair Stack', shortName: 'Chairs', emoji: '🪑',
      weight: 74, fragility: 48, primaryEffect: 'MULTI_DROP', secondaryEffects: ['RICOCHET', 'BOUNCE'],
      shape: 'tall', primaryColor: '#2563eb', secondaryColor: '#1e293b', accentColor: '#94a3b8', badgeText: 'STACK',
      tagline: '12 stacked swivel chairs separating mid-air like a MIRV warhead.'
    },
    {
      id: 'bookcase', name: 'Bookcase', shortName: 'Bookcase', emoji: '📖',
      weight: 210, fragility: 44, primaryEffect: 'SHATTER', secondaryEffects: ['RAIN_OF_OBJECTS', 'FRAGMENT'],
      shape: 'tall', primaryColor: '#78350f', secondaryColor: '#ef4444', accentColor: '#facc15', badgeText: 'BOOKS',
      tagline: 'Swedish flat-pack furniture returning to its natural flat-pack state.'
    },

    // === RIDICULOUS STUFF ===
    {
      id: 'moon_rock', name: 'Moon Rock', shortName: 'Moon Rock', emoji: '🪨',
      weight: 95, fragility: 110, primaryEffect: 'MOON_GRAVITY', secondaryEffects: ['FLOOR_CRACK', 'ANTI_GRAVITY'],
      shape: 'round', primaryColor: '#94a3b8', secondaryColor: '#cbd5e1', accentColor: '#38bdf8',
      tagline: 'Brings Apollo-11 lunar gravity right into your living room.'
    },
    {
      id: 'tiny_moon', name: 'Tiny Moon', shortName: 'Tiny Moon', emoji: '🌙',
      weight: 420, fragility: 90, primaryEffect: 'MOON_GRAVITY', secondaryEffects: ['BLACK_HOLE', 'FLOOR_CRACK'],
      shape: 'round', primaryColor: '#cbd5e1', secondaryColor: '#94a3b8', accentColor: '#facc15',
      tagline: 'That’s no moon... actually wait, it IS a tiny moon.'
    },
    {
      id: 'bigger_moon', name: 'Bigger Moon', shortName: 'BiggerMoon', emoji: '🌕',
      weight: 950, fragility: 85, primaryEffect: 'BLACK_HOLE', secondaryEffects: ['MOON_GRAVITY', 'EXPLODE', 'FLOOR_CRACK'],
      shape: 'round', primaryColor: '#fef08a', secondaryColor: '#94a3b8', accentColor: '#f97316',
      tagline: 'High tide is now inside your browser window.'
    },
    {
      id: 'tax_audit', name: 'Tax Audit', shortName: 'Tax Audit', emoji: '🧾',
      weight: 666, fragility: 50, primaryEffect: 'GOLD_BURST', secondaryEffects: ['FLOOR_CRACK', 'GLITCH'],
      shape: 'doc', primaryColor: '#fef2f2', secondaryColor: '#eab308', accentColor: '#dc2626', badgeText: 'IRS',
      tagline: 'Heaviest known object in the observable financial universe.'
    },
    {
      id: 'technical_debt', name: 'Technical Debt', shortName: 'Tech Debt', emoji: '🍝',
      weight: 777, fragility: 30, primaryEffect: 'GLITCH', secondaryEffects: ['CHAIN_REACTION', 'SPAWN_OBJECT'],
      shape: 'doc', primaryColor: '#1e293b', secondaryColor: '#22d3ee', accentColor: '#ef4444', badgeText: 'TODO',
      tagline: 'We told you we’d refactor it in Sprint 42. Now look what happened.'
    },
    {
      id: 'extended_warranty', name: 'Extended Warranty', shortName: 'Warranty', emoji: '📜',
      weight: 15, fragility: 999, primaryEffect: 'RICOCHET', secondaryEffects: ['MEGA_BOUNCE', 'SPAWN_OBJECT'],
      shape: 'doc', primaryColor: '#fef9c3', secondaryColor: '#f97316', accentColor: '#dc2626', badgeText: 'CALL',
      tagline: 'We’ve been trying to reach you about your floor’s extended warranty!'
    },
    {
      id: 'internet_comment_section', name: 'Internet Comment Section', shortName: 'Comments', emoji: '🤬',
      weight: 500, fragility: 20, primaryEffect: 'CHAIN_REACTION', secondaryEffects: ['EXPLODE', 'GLITCH', 'SPLATTER'],
      shape: 'monitor', primaryColor: '#dc2626', secondaryColor: '#facc15', accentColor: '#1e293b', badgeText: 'RANT',
      tagline: '100% toxic combustible opinions. Do not feed after midnight.'
    },
    {
      id: 'mystery_government_box', name: 'Mystery Government Box', shortName: 'Area 51', emoji: '👽',
      weight: 350, fragility: 45, primaryEffect: 'PORTAL', secondaryEffects: ['ANTI_GRAVITY', 'SPAWN_OBJECT', 'GLITCH'],
      shape: 'box', primaryColor: '#3f6212', secondaryColor: '#84cc16', accentColor: '#22d3ee', badgeText: 'TOPSEC',
      tagline: '[REDACTED BY DEPARTMENT OF GRAVITATIONAL ANOMALIES]'
    },
    {
      id: 'quantum_watermelon', name: 'Quantum Watermelon', shortName: 'Q-Melon', emoji: '⚛️',
      weight: 42, fragility: 25, primaryEffect: 'ANTI_GRAVITY', secondaryEffects: ['PORTAL', 'SPLATTER', 'GLITCH'],
      shape: 'round', primaryColor: '#06b6d4', secondaryColor: '#ec4899', accentColor: '#a855f7',
      tagline: 'Simultaneously intact, splattered, and breaking gravity for the next 3 drops.'
    },
    {
      id: 'cursed_toaster', name: 'Cursed Toaster', shortName: 'HexToaster', emoji: '😈',
      weight: 66, fragility: 33, primaryEffect: 'BLACK_HOLE', secondaryEffects: ['CHAIN_REACTION', 'DUCKIFIED'],
      shape: 'box', primaryColor: '#581c87', secondaryColor: '#ef4444', accentColor: '#facc15', badgeText: 'HEX',
      tagline: 'Toasts bread, summons singularities, and turns shrapnel into ducks.'
    },
    {
      id: 'rubber_duck_emperor', name: 'Rubber Duck Emperor', shortName: 'Duck King', emoji: '👑',
      weight: 220, fragility: 85, primaryEffect: 'DUCK_STORM', secondaryEffects: ['DUCKIFIED', 'GOLD_BURST', 'MEGA_BOUNCE'],
      shape: 'duck', primaryColor: '#facc15', secondaryColor: '#ef4444', accentColor: '#eab308',
      tagline: 'ALL HAIL QUACKIUS MAXIMUS! Commands legions of chaotic bath ducks.'
    },
    {
      id: 'suspicious_crate', name: 'Suspicious Crate', shortName: 'Sus Crate', emoji: '📦',
      weight: 130, fragility: 35, primaryEffect: 'SPAWN_OBJECT', secondaryEffects: ['DUCK_STORM', 'EXPLODE'],
      shape: 'box', primaryColor: '#92400e', secondaryColor: '#f59e0b', accentColor: '#ef4444', badgeText: 'SUS',
      tagline: 'Wait... why was that crate quacking and ticking at the same time?'
    },
    {
      id: 'angry_filing_cabinet', name: 'Angry Filing Cabinet', shortName: 'AngryCab', emoji: '💢',
      weight: 290, fragility: 48, primaryEffect: 'CHAIN_REACTION', secondaryEffects: ['RICOCHET', 'FLOOR_CRACK'],
      shape: 'tall', primaryColor: '#991b1b', secondaryColor: '#ef4444', accentColor: '#facc15', badgeText: 'GRRR',
      tagline: 'Fed up with tax season and ready to fight the floorboards.'
    },
    {
      id: 'emotionally_damaged_printer', name: 'Emotionally Damaged Printer', shortName: 'SadPrinter', emoji: '😭',
      weight: 54, fragility: 18, primaryEffect: 'GLITCH', secondaryEffects: ['EXPLODE', 'SPLATTER', 'CONFETTI'],
      shape: 'box', primaryColor: '#475569', secondaryColor: '#38bdf8', accentColor: '#f43f5e', badgeText: 'SOB',
      tagline: 'Cries cyan ink tears and refuses to print black-and-white.'
    },
    {
      id: 'unpaid_invoice', name: 'Unpaid Invoice', shortName: 'Invoice', emoji: '💸',
      weight: 85, fragility: 40, primaryEffect: 'GOLD_BURST', secondaryEffects: ['RICOCHET', 'FRAGMENT'],
      shape: 'doc', primaryColor: '#fee2e2', secondaryColor: '#22c55e', accentColor: '#dc2626', badgeText: 'PAST',
      tagline: 'NET-30 DAYS OVERDUE! Explodes into coins out of pure spite.'
    },

    // === LEGENDARY STUFF ===
    {
      id: 'the_thing', name: 'The Thing', shortName: 'The Thing', emoji: '🟣',
      weight: 300, fragility: 50, primaryEffect: 'EXPLODE', secondaryEffects: ['PORTAL', 'CONFETTI', 'FLOOR_CRACK'],
      shape: 'thing', primaryColor: '#8b5cf6', secondaryColor: '#facc15', accentColor: '#ec4899',
      tagline: 'Wait—THAT’S The Thing we’ve been dropping this whole time?!'
    },
    {
      id: 'bigger_thing', name: 'Bigger Thing', shortName: 'BiggerThing', emoji: '🟠',
      weight: 500, fragility: 55, primaryEffect: 'CHAIN_REACTION', secondaryEffects: ['MEGA_BOUNCE', 'FLOOR_CRACK'],
      shape: 'thing', primaryColor: '#f97316', secondaryColor: '#fde047', accentColor: '#dc2626',
      tagline: 'Like The Thing, except noticeably girthier.'
    },
    {
      id: 'even_bigger_thing', name: 'Even Bigger Thing', shortName: 'Huge Thing', emoji: '🔴',
      weight: 750, fragility: 60, primaryEffect: 'RAIN_OF_OBJECTS', secondaryEffects: ['EXPLODE', 'FLOOR_CRACK'],
      shape: 'thing', primaryColor: '#ef4444', secondaryColor: '#facc15', accentColor: '#7f1d1d',
      tagline: 'Scientists warned us not to make The Thing this big.'
    },
    {
      id: 'forbidden_thing', name: 'Forbidden Thing', shortName: 'Forbidden', emoji: '👁️',
      weight: 666, fragility: 45, primaryEffect: 'BLACK_HOLE', secondaryEffects: ['GLITCH', 'PORTAL', 'DUCKIFIED'],
      shape: 'thing', primaryColor: '#1e1b4b', secondaryColor: '#e11d48', accentColor: '#22d3ee',
      tagline: 'Do not look directly at the Forbidden Thing during freefall.'
    },
    {
      id: 'definitely_not_a_thing', name: 'Definitely Not A Thing', shortName: 'NotAThing', emoji: '🥸',
      weight: 123, fragility: 40, primaryEffect: 'DUCKIFIED', secondaryEffects: ['SPAWN_OBJECT', 'CONFETTI'],
      shape: 'thing', primaryColor: '#10b981', secondaryColor: '#fef08a', accentColor: '#f97316',
      tagline: 'Wearing a fake mustache. Nothing to see here, officer.'
    },
    {
      id: 'the_original_thing', name: 'The Original Thing', shortName: 'OG Thing', emoji: '🏛️',
      weight: 400, fragility: 55, primaryEffect: 'GOLD_BURST', secondaryEffects: ['SHATTER', 'FLOOR_CRACK'],
      shape: 'thing', primaryColor: '#d97706', secondaryColor: '#fef3c7', accentColor: '#78350f',
      tagline: 'Vintage 1983 artisanal hand-crafted Thing.'
    },
    {
      id: 'thing_prime', name: 'Thing Prime', shortName: 'ThingPrime', emoji: '🤖',
      weight: 850, fragility: 65, primaryEffect: 'CHAIN_REACTION', secondaryEffects: ['PORTAL', 'GOLD_BURST', 'FLOOR_CRACK'],
      shape: 'thing', primaryColor: '#2563eb', secondaryColor: '#ef4444', accentColor: '#facc15',
      tagline: 'Autobots, roll—wait no, just drop straight down.'
    },
    {
      id: 'thing_2', name: 'Thing 2', shortName: 'Thing 2', emoji: '🌀',
      weight: 222, fragility: 35, primaryEffect: 'MULTI_DROP', secondaryEffects: ['SPRING_LAUNCH', 'RICOCHET', 'CONFETTI'],
      shape: 'thing', primaryColor: '#ec4899', secondaryColor: '#38bdf8', accentColor: '#fde047',
      tagline: 'Twice the Thing, zero Dr. Seuss supervision.'
    },
    {
      id: 'thing_xl', name: 'Thing XL', shortName: 'Thing XL', emoji: '💪',
      weight: 920, fragility: 75, primaryEffect: 'FLOOR_CRACK', secondaryEffects: ['EXPLODE', 'RAIN_OF_OBJECTS', 'MEGA_BOUNCE'],
      shape: 'thing', primaryColor: '#7c3aed', secondaryColor: '#4ade80', accentColor: '#facc15',
      tagline: 'Now with 40% more unnecessary mass!'
    },
    {
      id: 'ultimate_thing', name: 'Ultimate Thing', shortName: 'Ultimate', emoji: '🌟',
      weight: 1000, fragility: 80, primaryEffect: 'BLACK_HOLE', secondaryEffects: ['GOLD_BURST', 'DUCK_STORM', 'CHAIN_REACTION', 'RAIN_OF_OBJECTS', 'GLITCH'],
      shape: 'thing', primaryColor: '#facc15', secondaryColor: '#9333ea', accentColor: '#ef4444',
      tagline: 'The final boss of bad gravitational decisions.'
    },

    // === MULTI_DROP & SPECIAL EFFECT SHOWCASE ITEMS (Completing 108 Objects = 9 Full Pages of 12) ===
    {
      id: 'bowling_ball_bag', name: 'Bowling Ball Bag', shortName: 'Bowl Bag', emoji: '👜',
      weight: 52, fragility: 40, primaryEffect: 'MULTI_DROP', secondaryEffects: ['BOUNCE', 'FLOOR_CRACK'],
      shape: 'box', primaryColor: '#1e1b4b', secondaryColor: '#f43f5e', accentColor: '#facc15', badgeText: '3BALL',
      tagline: 'Zipper fails mid-air, unleashing a 3-ball ten-pin apocalypse.'
    },
    {
      id: 'crate_of_bricks', name: 'Crate of Bricks', shortName: 'BrickCrate', emoji: '🏗️',
      weight: 160, fragility: 45, primaryEffect: 'MULTI_DROP', secondaryEffects: ['SHATTER', 'FLOOR_CRACK'],
      shape: 'box', primaryColor: '#991b1b', secondaryColor: '#d97706', accentColor: '#fca5a5', badgeText: 'BRICKS',
      tagline: 'Why drop one brick when you can drop a whole pallet?'
    },
    {
      id: 'carton_of_watermelons', name: 'Carton of Watermelons', shortName: 'MelonBox', emoji: '🍉',
      weight: 90, fragility: 24, primaryEffect: 'MULTI_DROP', secondaryEffects: ['SPLATTER', 'RAIN_OF_OBJECTS'],
      shape: 'box', primaryColor: '#15803d', secondaryColor: '#ef4444', accentColor: '#86efac', badgeText: 'MELONS',
      tagline: 'Bulk grocery shopping meets terminal velocity.'
    },
    {
      id: 'mystery_crate', name: 'Mystery Crate', shortName: 'MystCrate', emoji: '🧰',
      weight: 175, fragility: 38, primaryEffect: 'SPAWN_OBJECT', secondaryEffects: ['EXPLODE', 'FLOOR_CRACK'],
      shape: 'box', primaryColor: '#b45309', secondaryColor: '#fde047', accentColor: '#dc2626', badgeText: 'CRATE',
      tagline: 'Breaks open on impact to reveal an even heavier poor decision.'
    },
    {
      id: 'gold_chest', name: 'Pirate Treasure Chest', shortName: 'GoldChest', emoji: '🪙',
      weight: 260, fragility: 50, primaryEffect: 'GOLD_BURST', secondaryEffects: ['SHATTER', 'CONFETTI'],
      shape: 'box', primaryColor: '#854d0e', secondaryColor: '#facc15', accentColor: '#fef08a', badgeText: 'GOLD',
      tagline: 'Yarrr! Plundered doubloons flying at irresponsible speeds.'
    },
    {
      id: 'black_hole_orb', name: 'Pocket Singularity', shortName: 'BlackHole', emoji: '🕳️',
      weight: 888, fragility: 60, primaryEffect: 'BLACK_HOLE', secondaryEffects: ['ANTI_GRAVITY', 'GLITCH'],
      shape: 'round', primaryColor: '#090d16', secondaryColor: '#6366f1', accentColor: '#ec4899',
      tagline: 'Warning: May void warranty on local spacetime continuum.'
    },
    {
      id: 'portal_cube', name: 'Wormhole Cube', shortName: 'PortalCube', emoji: '🌀',
      weight: 115, fragility: 42, primaryEffect: 'PORTAL', secondaryEffects: ['SPAWN_OBJECT', 'RICOCHET'],
      shape: 'box', primaryColor: '#0284c7', secondaryColor: '#f97316', accentColor: '#e0f2fe', badgeText: 'PORTAL',
      tagline: 'Speedy thing goes in, speedy thing comes out.'
    },
    {
      id: 'duck_cannon', name: 'Duck Bazooka Crate', shortName: 'DuckCrate', emoji: '🦆',
      weight: 95, fragility: 30, primaryEffect: 'DUCK_STORM', secondaryEffects: ['DUCKIFIED', 'EXPLODE'],
      shape: 'box', primaryColor: '#eab308', secondaryColor: '#f97316', accentColor: '#fef08a', badgeText: 'QUACK',
      tagline: 'Weaponized waterfowl containment unit.'
    },
    {
      id: 'spring_mattress', name: 'King Spring Mattress', shortName: 'Mattress', emoji: '🛏️',
      weight: 110, fragility: 700, primaryEffect: 'SPRING_LAUNCH', secondaryEffects: ['MEGA_BOUNCE', 'RICOCHET'],
      shape: 'box', primaryColor: '#3b82f6', secondaryColor: '#f8fafc', accentColor: '#93c5fd', badgeText: 'BOING',
      tagline: '800 pocketed steel coils ready to launch into low Earth orbit.'
    },
    {
      id: 'glitch_cartridge', name: '64-Bit Glitch Cartridge', shortName: 'Cartridge', emoji: '👾',
      weight: 8, fragility: 26, primaryEffect: 'GLITCH', secondaryEffects: ['PORTAL', 'DUCKIFIED'],
      shape: 'tall', primaryColor: '#6d28d9', secondaryColor: '#22d3ee', accentColor: '#f43f5e', badgeText: '0xFF',
      tagline: 'Blowing into the connector only made reality more corrupted.'
    }
  ];

  // Expand each raw item into a rich, normalized Object Entry
  const OBJECTS = RAW_CATALOG.map((item) => {
    const primaryEffect = EFFECTS[item.primaryEffect] ? item.primaryEffect : 'SHATTER';
    const secondaryEffects = Array.isArray(item.secondaryEffects)
      ? item.secondaryEffects.filter((e) => EFFECTS[e] && e !== primaryEffect)
      : [];
    const allEffects = [primaryEffect, ...secondaryEffects];

    // Legacy lowercase mapping ('shatter', 'splatter', 'bounce', 'explode')
    const legacyMap = {
      SHATTER: 'shatter',
      SPLATTER: 'splatter',
      BOUNCE: 'bounce',
      EXPLODE: 'explode',
      GOLD_BURST: 'shatter',
      DUCK_STORM: 'explode',
      MULTI_DROP: 'shatter',
      FLOOR_CRACK: 'shatter',
      MEGA_BOUNCE: 'bounce',
      ANTI_GRAVITY: 'bounce',
      CONFETTI: 'explode',
      SPRING_LAUNCH: 'bounce',
      CHAIN_REACTION: 'explode',
      SPAWN_OBJECT: 'explode',
      FRAGMENT: 'shatter',
      PORTAL: 'explode',
      RICOCHET: 'bounce',
      BLACK_HOLE: 'explode',
      MOON_GRAVITY: 'bounce',
      RAIN_OF_OBJECTS: 'explode',
      GLITCH: 'explode',
      DUCKIFIED: 'explode'
    };
    const specialEffect = legacyMap[primaryEffect] || 'shatter';

    // Weight modifier scales with weight so heavy/legendary objects feel extra rewarding
    const weightModifier = Number(
      item.weightModifier ||
      Math.max(1.1, Math.min(3.8, 1.15 + Math.log10(Math.max(1, item.weight)) * 0.62)).toFixed(2)
    );

    const breakageBonus = item.breakageBonus || Math.round(120 + Math.min(300, item.weight * 0.25));
    const specialEffectBonus = allEffects.reduce(
      (sum, effKey) => sum + (EFFECTS[effKey] ? EFFECTS[effKey].bonus : 120),
      0
    );

    const isBouncy =
      primaryEffect === 'BOUNCE' ||
      primaryEffect === 'MEGA_BOUNCE' ||
      primaryEffect === 'SPRING_LAUNCH' ||
      secondaryEffects.includes('MEGA_BOUNCE') ||
      secondaryEffects.includes('SPRING_LAUNCH');

    const restitution = isBouncy ? 0.94 : 0.28;
    const radius = Math.max(26, Math.min(44, Math.round(27 + Math.log10(Math.max(1, item.weight)) * 5.2)));

    const art = buildVisualArtwork(item);

    return {
      id: item.id,
      name: item.name,
      shortName: item.shortName || item.name.slice(0, 11),
      emoji: item.emoji || '📦',
      weight: item.weight,
      weightUnit: 'lbs',
      weightModifier,
      fragility: item.fragility,
      primaryEffect,
      secondaryEffects,
      allEffects,
      specialEffect, // backward-compatible lowercase string
      breakageBonus,
      specialEffectBonus,
      restitution,
      radius,
      primaryColor: item.primaryColor,
      secondaryColor: item.secondaryColor,
      accentColor: item.accentColor,
      shardColors: [
        item.primaryColor,
        item.secondaryColor,
        item.accentColor,
        '#facc15',
        '#f8fafc',
        '#1e293b'
      ],
      splatterColors: [
        item.secondaryColor,
        item.primaryColor,
        item.accentColor,
        '#facc15'
      ],
      tagline: item.tagline,
      modernSvg: art.modernSvg,
      retroSvg: art.retroSvg
    };
  });

  // Large library of contextual and absurd micro-taunts
  const GENERAL_TAUNTS = [
    'Somewhere, an engineer is nodding approvingly.',
    'That probably voided the warranty.',
    'Gravity remains undefeated.',
    'The ducks are pleased.',
    'The floor has filed a complaint.',
    'An insurance adjuster sensed a disturbance.',
    'Physics would like a word.',
    'Object successfully objected.',
    'Nice drop, gravity champion.',
    'Sir Isaac Newton is weeping tears of joy.',
    'That floor had a family, you know.',
    '100% Certified Pointless. Drop another one!',
    'Gravity: 1, Structural Integrity: 0.',
    'Science called. They said "keep dropping stuff."',
    'Cleanup on aisle everywhere.',
    'Your finger clicked. Gravity did 99.9% of the work.',
    'An interactive museum of poor decisions powered by gravity.',
    'Look at those big goofy numbers go!',
    'OSHA has left the chat.',
    'Downstairs neighbors are moving out.',
    'Structural engineers hate this one weird trick.',
    'Wait—why did that make so many ducks?!',
    'Spacetime briefly reconsidered its career choices.',
    'Congratulations, you invented a brand new kind of mess.'
  ];

  const OBJECT_MAP = new Map();
  for (const obj of OBJECTS) {
    OBJECT_MAP.set(obj.id, obj);
    OBJECT_MAP.set(obj.id.replace(/_/g, '-'), obj);
    OBJECT_MAP.set(obj.id.replace(/_/g, ''), obj);
  }

  function getObjectById(rawId) {
    if (!rawId || typeof rawId !== 'string') return null;
    const key = rawId.trim().toLowerCase();
    return OBJECT_MAP.get(key) || null;
  }

  function getRandomObject() {
    return OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
  }

  /**
   * Canonical Score Formula:
   * Score = chaos factor
   * Chaos factor = (impact force * weight modifier) + (breakage bonus) + (special effect bonus)
   * + optional extra effect bonus (e.g. ducks spawned, fragments, multi-drops, chain reactions)
   */
  function calculateChaosScore(params) {
    const obj = typeof params.object === 'string' ? getObjectById(params.object) : params.object;
    if (!obj) {
      throw new Error('Valid drop object required to calculate chaos score.');
    }

    const impactForce = Math.max(1, Math.round(Number(params.impactForce) || 0));
    const weightModifier = Number(obj.weightModifier);
    const didBreak = params.didBreak !== undefined
      ? Boolean(params.didBreak)
      : (obj.fragility < impactForce);

    const impactScore = Math.round(impactForce * weightModifier);
    const breakageBonus = didBreak ? obj.breakageBonus : 0;
    const extraEffectBonus = Math.max(0, Math.round(Number(params.extraEffectBonus) || 0));
    const specialEffectBonus = obj.specialEffectBonus + extraEffectBonus;
    const chaosFactor = Math.round(impactScore + breakageBonus + specialEffectBonus);

    return {
      objectId: obj.id,
      objectName: obj.name,
      impactForce,
      fragility: obj.fragility,
      weight: obj.weight,
      weightModifier,
      didBreak,
      primaryEffect: obj.primaryEffect,
      secondaryEffects: obj.secondaryEffects,
      allEffects: obj.allEffects,
      specialEffect: obj.specialEffect,
      impactScore,
      breakageBonus,
      specialEffectBonus,
      chaosFactor,
      score: chaosFactor
    };
  }

  function getRandomTaunt(objectId, triggeredEffects = []) {
    if (Array.isArray(triggeredEffects)) {
      if (triggeredEffects.includes('DUCK_STORM') || triggeredEffects.includes('DUCKIFIED')) {
        if (Math.random() < 0.55) return 'The ducks are pleased.';
      }
      if (triggeredEffects.includes('FLOOR_CRACK')) {
        if (Math.random() < 0.45) return 'The floor has filed a complaint.';
      }
      if (triggeredEffects.includes('GLITCH') || triggeredEffects.includes('BLACK_HOLE') || triggeredEffects.includes('PORTAL')) {
        if (Math.random() < 0.45) return 'Physics would like a word.';
      }
    }
    return GENERAL_TAUNTS[Math.floor(Math.random() * GENERAL_TAUNTS.length)];
  }

  function getObjectSvg(objectId, mode = 'modern') {
    const obj = getObjectById(objectId) || OBJECTS[0];
    return mode === 'retro' ? obj.retroSvg : obj.modernSvg;
  }

  function buildSharePath(objectId, score) {
    const obj = getObjectById(objectId) || OBJECTS[0];
    const cleanScore = Math.max(0, Math.round(Number(score) || 0));
    return `/drop?object=${encodeURIComponent(obj.id)}&score=${encodeURIComponent(cleanScore)}`;
  }

  return {
    EFFECTS,
    OBJECTS,
    GENERAL_TAUNTS,
    getObjectById,
    getRandomObject,
    calculateChaosScore,
    getRandomTaunt,
    getObjectSvg,
    buildSharePath
  };
});
