/**
 * Drop The Thing - Custom 2D Rigid-Body, Multi-Effect & Absurdity Physics Engine (Expansion Pass)
 * Supports all 22 Effects simultaneously:
 * SHATTER, SPLATTER, BOUNCE, EXPLODE, GOLD_BURST, DUCK_STORM, MULTI_DROP, FLOOR_CRACK,
 * MEGA_BOUNCE, ANTI_GRAVITY, CONFETTI, SPRING_LAUNCH, CHAIN_REACTION, SPAWN_OBJECT,
 * FRAGMENT, PORTAL, RICOCHET, BLACK_HOLE, MOON_GRAVITY, RAIN_OF_OBJECTS, GLITCH, DUCKIFIED.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const DropObjects = require('./objects');
    module.exports = factory(DropObjects);
  } else {
    root.DropPhysics = factory(root.DropObjects);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (DropObjects) {
  'use strict';

  const GRAVITY = 980; // px/s^2

  /**
   * Generic Registry of Post-Drop Environmental Effects.
   * Multiple environmental effects can coexist and stack simultaneously.
   */
  const ENVIRONMENTAL_EFFECT_DEFS = {
    antiGravity: {
      id: 'antiGravity',
      name: 'Anti-Gravity Field',
      icon: '🛸',
      initialStrength: 0.6,
      initialDrops: 3,
      decayRate: 0.2,
      showStrength: true,
      alertTitle: 'ANTI-GRAVITY FIELD DETECTED',
      alertDetail: 'Gravity reduced by 60% • Duration: 3 drops',
      collapseMessage: 'Field collapses • Gravity restored'
    },
    slipperyFloor: {
      id: 'slipperyFloor',
      name: 'Slippery Floor',
      icon: '🍌',
      initialStrength: 0.6,
      initialDrops: 3,
      decayRate: 0.2,
      showStrength: false,
      alertTitle: 'SLIPPERY FLOOR DETECTED',
      alertDetail: 'Surface friction reduced • Duration: 3 drops',
      collapseMessage: 'Floor dried • Traction restored'
    },
    moonGravity: {
      id: 'moonGravity',
      name: 'Moon Gravity',
      icon: '🌙',
      initialStrength: 0.5,
      initialDrops: 3,
      decayRate: 0.15,
      showStrength: true,
      alertTitle: 'LUNAR GRAVITY ANOMALY',
      alertDetail: 'Gravity reduced by 50% • Duration: 3 drops',
      collapseMessage: 'Lunar field faded • Gravity restored'
    },
    duckStormActivity: {
      id: 'duckStormActivity',
      name: 'Duck Storm Activity',
      icon: '🦆',
      initialStrength: 0.6,
      initialDrops: 3,
      decayRate: 0.2,
      showStrength: false,
      alertTitle: 'DUCK STORM ACTIVITY',
      alertDetail: 'Spontaneous waterfowl on impact • Duration: 3 drops',
      collapseMessage: 'Duck Storm subsided'
    },
    glitchZone: {
      id: 'glitchZone',
      name: 'Glitch Zone',
      icon: '👾',
      initialStrength: 0.6,
      initialDrops: 3,
      decayRate: 0.2,
      showStrength: true,
      alertTitle: 'GLITCH ZONE ACTIVE',
      alertDetail: 'Physics buffer corrupted • Duration: 3 drops',
      collapseMessage: 'Glitch Zone stabilized'
    },
    megaBounce: {
      id: 'megaBounce',
      name: 'Mega Bounce Floor',
      icon: '🟢',
      initialStrength: 0.6,
      initialDrops: 3,
      decayRate: 0.2,
      showStrength: true,
      alertTitle: 'ELASTIC FLOOR ACTIVE',
      alertDetail: 'Floor rebounds everything • Duration: 3 drops',
      collapseMessage: 'Floor elasticity normalized'
    }
  };

  function createRng(seed) {
    if (typeof seed !== 'number' || !Number.isFinite(seed)) {
      return () => Math.random();
    }
    let s = seed >>> 0 || 123456789;
    return function () {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function computeImpactForce(impactSpeedPxPerSec, obj, slamBoost = false, randomVariance = 0) {
    const baseSpeedFactor = Math.max(10, Math.abs(impactSpeedPxPerSec)) / 11.2;
    const weightCurve = 0.88 + Math.log10(Math.max(1, obj.weight + 0.8)) * 0.42;
    const boostMult = slamBoost ? 1.38 : 1.0;
    const rawForce = baseSpeedFactor * weightCurve * boostMult + randomVariance;
    return Math.max(5, Math.round(rawForce));
  }

  /**
   * Headless simulation of a drop outcome (supports all 22 effects & multi-effect bonuses).
   */
  function simulateDropOutcome(objectId, options = {}) {
    const obj = typeof objectId === 'string'
      ? DropObjects.getObjectById(objectId)
      : objectId;

    if (!obj) {
      throw new Error(`Unknown object: ${objectId}`);
    }

    const rng = createRng(options.seed);
    const dropHeightPx = Number(options.dropHeightPx) || 490;
    const slamBoost = Boolean(options.slamBoost);
    const gravity = slamBoost ? GRAVITY * 1.35 : GRAVITY;

    const impactSpeed = Math.sqrt(2 * gravity * dropHeightPx);
    const variance = Math.round((rng() - 0.35) * 8);
    const impactForce = computeImpactForce(impactSpeed, obj, slamBoost, variance);

    const didBreak = obj.fragility < impactForce;
    const effects = obj.allEffects || [obj.primaryEffect];

    const effectsTriggered = {
      broke: didBreak,
      activeEffects: effects,
      splatterDecalsSpawned: effects.includes('SPLATTER') ? (didBreak ? 16 : 6) : 0,
      particleBurstCount: effects.includes('EXPLODE') || effects.includes('CHAIN_REACTION') ? 58 : 18,
      shatterShardCount: didBreak || effects.includes('FRAGMENT') ? 24 : 0,
      exaggeratedCartoonBounce: effects.includes('BOUNCE') || effects.includes('MEGA_BOUNCE') || effects.includes('SPRING_LAUNCH'),
      goldBurstCoins: effects.includes('GOLD_BURST') ? 24 : 0,
      ducksSpawned: effects.includes('DUCK_STORM') || effects.includes('DUCKIFIED') ? 14 : 0,
      floorCracked: effects.includes('FLOOR_CRACK'),
      multiDropped: effects.includes('MULTI_DROP'),
      glitchActive: effects.includes('GLITCH'),
      blackHoleActive: effects.includes('BLACK_HOLE'),
      portalOpened: effects.includes('PORTAL')
    };

    const scoreResult = DropObjects.calculateChaosScore({
      object: obj,
      impactForce,
      didBreak
    });

    return {
      ...scoreResult,
      impactSpeed: Math.round(impactSpeed),
      effectsTriggered,
      taunt: DropObjects.getRandomTaunt(obj.id, effects)
    };
  }

  /**
   * Interactive 2D Canvas Physics World for the Drop Zone.
   */
  class DropWorld {
    constructor(canvas, callbacks = {}) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.callbacks = callbacks;

      this.width = 480;
      this.height = 600;
      this.floorY = 540;
      this.spawnY = 58;
      this.mode = 'modern';
      this.slamBoost = false;

      // Active physics entities
      this.activeBodies = [];
      this.shards = [];
      this.particles = [];
      this.splatterDecals = [];
      this.floorCracks = [];
      this.floatingTexts = [];
      this.shockwaves = [];
      this.blackHoles = [];
      this.portals = [];
      this.scheduledEvents = [];
      this.glitchPopups = [];

      // Environmental modifiers & generic post-drop activeEffects infrastructure
      // Structure: [{ id: "antiGravity", strength: 0.6, remainingDrops: 3, decayRate: 0.2, ... }]
      this.activeEffects = [];
      this.shakeTime = 0;
      this.shakeMagnitude = 0;
      this.moonGravityTimer = 0;
      this.glitchTimer = 0;
      this._ambientPulsePhase = 0;

      // Cached SVG Image objects
      this.imageCache = { modern: {}, retro: {} };
      this._preloadSvgImages();

      this._running = false;
      this._lastTimestamp = 0;
      this._boundTick = this._tick.bind(this);

      if (this.canvas) {
        this.resize();
      }
    }

    _preloadSvgImages() {
      if (typeof Image === 'undefined') return;
      for (const obj of DropObjects.OBJECTS) {
        for (const mode of ['modern', 'retro']) {
          const svgStr = mode === 'retro' ? obj.retroSvg : obj.modernSvg;
          const img = new Image();
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
          this.imageCache[mode][obj.id] = img;
        }
      }
    }

    setMode(mode) {
      this.mode = mode === 'retro' ? 'retro' : 'modern';
      this.render();
    }

    setSlamBoost(enabled) {
      this.slamBoost = Boolean(enabled);
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      this.width = Math.max(300, Math.floor(rect.width || 480));
      this.height = Math.max(460, Math.floor(rect.height || 600));
      this.floorY = this.height - 54;
      this.spawnY = 58;

      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      if (this.ctx) {
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      this.render();
    }

    /**
     * Return active post-drop environmental effects array.
     */
    getActiveEffects() {
      return this.activeEffects.map((e) => ({ ...e }));
    }

    /**
     * Find an active environmental effect by id (e.g. 'antiGravity', 'slipperyFloor').
     */
    getEnvironmentalEffect(effectId) {
      return this.activeEffects.find((e) => e.id === effectId) || null;
    }

    /**
     * Compute current effective gravity multiplier from stacked environmental effects.
     * Example for Anti-Gravity Field (strength 0.6, decayRate 0.2):
     * - Drop 1 after activation (strength 0.6): Gravity = 40% normal (0.40)
     * - Drop 2 after activation (strength 0.4): Gravity = 60% normal (0.60)
     * - Drop 3 after activation (strength 0.2): Gravity = 80% normal (0.80)
     * - After 3 drops: Field collapses, Gravity = 100% normal (1.00)
     */
    getGravityMultiplier() {
      let mult = 1.0;
      const antiGrav = this.getEnvironmentalEffect('antiGravity');
      if (antiGrav && antiGrav.strength > 0) {
        mult *= Math.max(0.15, Number((1 - antiGrav.strength).toFixed(2)));
      }
      const moonGrav = this.getEnvironmentalEffect('moonGravity');
      if (moonGrav && moonGrav.strength > 0) {
        mult *= Math.max(0.25, Number((1 - moonGrav.strength * 0.65).toFixed(2)));
      }
      return Number(Math.max(0.18, mult).toFixed(2));
    }

    /**
     * Activate or refresh a post-drop environmental effect for subsequent drops.
     */
    activateEnvironmentalEffect(effectId, overrides = {}) {
      const def = ENVIRONMENTAL_EFFECT_DEFS[effectId];
      if (!def) return null;

      const strength = Number((overrides.strength ?? def.initialStrength).toFixed(2));
      const remainingDrops = Math.max(1, Math.round(overrides.remainingDrops ?? def.initialDrops));
      const decayRate = Number((overrides.decayRate ?? def.decayRate).toFixed(2));

      let existing = this.getEnvironmentalEffect(def.id);
      if (existing) {
        existing.strength = strength;
        existing.remainingDrops = remainingDrops;
        existing.decayRate = decayRate;
      } else {
        existing = {
          id: def.id,
          name: def.name,
          icon: def.icon,
          strength,
          remainingDrops,
          decayRate,
          showStrength: def.showStrength
        };
        this.activeEffects.push(existing);
      }

      this._spawnFloatingText(
        this.width / 2,
        this.spawnY + 62,
        `${def.icon} ${def.alertTitle}!`,
        '#2dd4bf'
      );

      if (typeof this.callbacks.onEnvironmentalEffectsChange === 'function') {
        this.callbacks.onEnvironmentalEffectsChange(this.getActiveEffects(), {
          type: 'activated',
          effectId: def.id,
          name: def.name,
          icon: def.icon,
          strength: existing.strength,
          remainingDrops: existing.remainingDrops,
          title: def.alertTitle,
          detail: def.alertDetail
        });
      }

      this.startLoop();
      return existing;
    }

    /**
     * Decay all active environmental effects after a subsequent drop completes.
     * Uses progressive weakening (e.g. strength 0.6 -> 0.4 -> 0.2 -> collapse).
     */
    decayEnvironmentalEffectsAfterDrop() {
      if (this.activeEffects.length === 0) return;

      const collapsed = [];
      for (let i = this.activeEffects.length - 1; i >= 0; i--) {
        const eff = this.activeEffects[i];
        eff.remainingDrops -= 1;
        eff.strength = Number(Math.max(0, eff.strength - eff.decayRate).toFixed(2));

        if (eff.remainingDrops <= 0 || eff.strength <= 0.001) {
          this.activeEffects.splice(i, 1);
          const def = ENVIRONMENTAL_EFFECT_DEFS[eff.id];
          const msg = def ? def.collapseMessage : `${eff.name} collapsed`;
          collapsed.push({ id: eff.id, name: eff.name, message: msg });
          this._spawnFloatingText(this.width / 2, this.spawnY + 86, msg, '#94a3b8');
        }
      }

      if (typeof this.callbacks.onEnvironmentalEffectsChange === 'function') {
        this.callbacks.onEnvironmentalEffectsChange(this.getActiveEffects(), {
          type: collapsed.length > 0 ? 'collapsed' : 'decayed',
          collapsed
        });
      }
    }

    /**
     * Mop Floor:
     * - Remove all debris
     * - Remove all active environmental effects
     * - Reset gravity & surface modifiers
     * - Display "CHAOS CLEARED / Reality reluctantly restored."
     */
    clearMess(byMop = true) {
      this.activeBodies = [];
      this.splatterDecals = [];
      this.floorCracks = [];
      this.shards = [];
      this.particles = [];
      this.shockwaves = [];
      this.floatingTexts = [];
      this.blackHoles = [];
      this.portals = [];
      this.scheduledEvents = [];
      this.glitchPopups = [];
      this.activeEffects = [];
      this.moonGravityTimer = 0;
      this.glitchTimer = 0;

      if (byMop) {
        this._spawnFloatingText(this.width / 2, this.height * 0.42, 'CHAOS CLEARED', '#22c55e');
        this._spawnFloatingText(this.width / 2, this.height * 0.49, 'Reality reluctantly restored.', '#38bdf8');
      }

      if (typeof this.callbacks.onEnvironmentalEffectsChange === 'function') {
        this.callbacks.onEnvironmentalEffectsChange([], {
          type: 'cleared',
          title: 'CHAOS CLEARED',
          detail: 'Reality reluctantly restored.'
        });
      }

      this.startLoop();
      this.render();
    }

    /**
     * Spawn an object at top center of the Drop Zone!
     */
    dropObject(objectId, customX = null, isSecondarySpawn = false) {
      const obj = DropObjects.getObjectById(objectId) || DropObjects.OBJECTS[0];
      const startX = typeof customX === 'number'
        ? Math.max(obj.radius + 16, Math.min(this.width - obj.radius - 16, customX))
        : this.width / 2;

      const effects = obj.allEffects || [obj.primaryEffect];
      const isRicochet = effects.includes('RICOCHET');

      const initialVx = isRicochet
        ? (Math.random() >= 0.5 ? 420 : -420)
        : (Math.random() - 0.5) * 55;
      const initialVy = this.slamBoost ? 240 : 30;
      const initialOmega = (Math.random() - 0.5) * 4.5 + (Math.random() >= 0.5 ? 1.4 : -1.4);

      const body = {
        object: obj,
        x: startX,
        y: this.spawnY,
        vx: initialVx,
        vy: initialVy,
        angle: 0,
        omega: initialOmega,
        radius: obj.radius,
        scaleX: 1,
        scaleY: 1,
        bounces: 0,
        maxImpactForce: 0,
        scored: isSecondarySpawn, // secondary spawns add bonus chaos directly
        isSecondarySpawn,
        multiSplitDone: false,
        antiGravDone: false,
        antiGravTimer: 0,
        springHoldTimer: 0,
        settledTimer: 0,
        trail: []
      };

      this.activeBodies.push(body);

      if (!isSecondarySpawn && typeof this.callbacks.onDropStart === 'function') {
        this.callbacks.onDropStart(obj);
      }

      this.startLoop();
      return body;
    }

    startLoop() {
      if (this._running) return;
      this._running = true;
      this._lastTimestamp = performance.now();
      requestAnimationFrame(this._boundTick);
    }

    _tick(timestamp) {
      if (!this._running) return;
      const rawDt = (timestamp - this._lastTimestamp) / 1000;
      this._lastTimestamp = timestamp;
      const dt = Math.min(0.035, Math.max(0.001, rawDt));

      this.step(dt);
      this.render();

      const hasActiveMotion =
        this.activeBodies.length > 0 ||
        this.activeEffects.length > 0 ||
        this.particles.length > 0 ||
        this.shockwaves.length > 0 ||
        this.floatingTexts.length > 0 ||
        this.blackHoles.length > 0 ||
        this.portals.length > 0 ||
        this.scheduledEvents.length > 0 ||
        this.shakeTime > 0 ||
        this.glitchTimer > 0 ||
        this.shards.some((s) => !s.asleep);

      if (hasActiveMotion) {
        requestAnimationFrame(this._boundTick);
      } else {
        this._running = false;
      }
    }

    step(dt) {
      this._ambientPulsePhase += dt * 3.2;
      if (this.shakeTime > 0) this.shakeTime = Math.max(0, this.shakeTime - dt);
      if (this.moonGravityTimer > 0) this.moonGravityTimer = Math.max(0, this.moonGravityTimer - dt);
      if (this.glitchTimer > 0) {
        this.glitchTimer = Math.max(0, this.glitchTimer - dt);
        if (this.glitchTimer <= 0) this.glitchPopups = [];
      }

      const antiGravEnv = this.getEnvironmentalEffect('antiGravity');
      const slipperyEnv = this.getEnvironmentalEffect('slipperyFloor');
      const glitchEnv = this.getEnvironmentalEffect('glitchZone');
      const megaBounceEnv = this.getEnvironmentalEffect('megaBounce');

      const baseG = this.slamBoost ? GRAVITY * 1.35 : GRAVITY;
      const g = baseG * this.getGravityMultiplier();

      // Anti-Gravity Field Visual Feedback:
      // 1) Floating ambient upward particles
      // 2) Occasional upward drifting debris on the floor
      if (antiGravEnv && antiGravEnv.strength > 0) {
        if (this.particles.length < 90 && Math.random() < (0.35 + antiGravEnv.strength * 0.4)) {
          this.particles.push({
            x: 24 + Math.random() * (this.width - 48),
            y: this.floorY - 4 - Math.random() * 40,
            vx: (Math.random() - 0.5) * 24,
            vy: -(45 + Math.random() * 75) * (0.5 + antiGravEnv.strength),
            size: 2.2 + Math.random() * 2.8,
            color: Math.random() < 0.6 ? '#2dd4bf' : '#a855f7',
            life: 1.4 + Math.random() * 0.8,
            maxLife: 2.2,
            gravity: false
          });
        }

        if (this.shards.length > 0 && Math.random() < (0.08 * antiGravEnv.strength)) {
          const idx = Math.floor(Math.random() * this.shards.length);
          const shard = this.shards[idx];
          if (shard && shard.y >= this.floorY - 40) {
            shard.asleep = false;
            shard.vy = -(55 + Math.random() * 95) * (0.5 + antiGravEnv.strength);
            shard.vx += (Math.random() - 0.5) * 40;
            shard.omega += (Math.random() - 0.5) * 3;
          }
        }
      }

      // Process delayed scheduled events (CHAIN_REACTION, RAIN_OF_OBJECTS, etc.)
      for (let i = this.scheduledEvents.length - 1; i >= 0; i--) {
        const ev = this.scheduledEvents[i];
        ev.delay -= dt;
        if (ev.delay <= 0) {
          this.scheduledEvents.splice(i, 1);
          ev.fn();
        }
      }

      // Update Portals
      for (let i = this.portals.length - 1; i >= 0; i--) {
        const pt = this.portals[i];
        pt.life -= dt;
        pt.angle += dt * 6;
        if (pt.life <= 0) this.portals.splice(i, 1);
      }

      // Update Black Holes & apply gravitational pull to shards and particles
      for (let i = this.blackHoles.length - 1; i >= 0; i--) {
        const bh = this.blackHoles[i];
        bh.life -= dt;
        bh.angle += dt * 9;

        for (const s of this.shards) {
          s.asleep = false;
          const dx = bh.x - s.x;
          const dy = bh.y - s.y;
          const dist = Math.max(18, Math.hypot(dx, dy));
          const pull = (26000 / (dist * 0.6)) * dt;
          s.vx += (dx / dist) * pull - (dy / dist) * 140 * dt;
          s.vy += (dy / dist) * pull + (dx / dist) * 140 * dt;
        }

        for (const p of this.particles) {
          const dx = bh.x - p.x;
          const dy = bh.y - p.y;
          const dist = Math.max(14, Math.hypot(dx, dy));
          const pull = (22000 / (dist * 0.6)) * dt;
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
        }

        if (bh.life <= 0) {
          // Black hole evaporates in a hawking radiation burst!
          this._spawnBurstParticles(bh.x, bh.y, ['#818cf8', '#ec4899', '#22d3ee', '#facc15'], 32, 420);
          for (const s of this.shards) {
            s.vx += (Math.random() - 0.5) * 520;
            s.vy -= 200 + Math.random() * 280;
          }
          this.blackHoles.splice(i, 1);
        }
      }

      // 1. Update Active Falling / Bouncing Bodies
      for (let bIdx = this.activeBodies.length - 1; bIdx >= 0; bIdx--) {
        const b = this.activeBodies[bIdx];
        const obj = b.object;
        const effects = obj.allEffects || [obj.primaryEffect];

        // Spring Launch compression hold on floor
        if (b.springHoldTimer > 0) {
          b.springHoldTimer -= dt;
          b.scaleX = 1.75;
          b.scaleY = 0.35;
          if (b.springHoldTimer <= 0) {
            b.vy = -1020;
            b.vx = (Math.random() - 0.5) * 420;
            b.omega = (Math.random() - 0.5) * 14;
            b.scaleX = 0.62;
            b.scaleY = 1.55;
            this._spawnFloatingText(b.x, this.floorY - 48, '🚀 SPRING LAUNCH!', '#f97316');
            this._spawnBurstParticles(b.x, this.floorY, ['#facc15', '#f97316', '#ffffff'], 20, 280);
          }
          continue;
        }

        // MULTI_DROP mid-air split check
        if (effects.includes('MULTI_DROP') && !b.multiSplitDone && b.y >= this.spawnY + 95) {
          b.multiSplitDone = true;
          this._spawnFloatingText(b.x, b.y - 20, '✨ MULTI-DROP x4!', '#a855f7');
          for (let m = 0; m < 3; m++) {
            const clone = {
              ...b,
              x: Math.max(36, Math.min(this.width - 36, b.x + (m - 1) * 44 + (Math.random() - 0.5) * 20)),
              y: b.y + (Math.random() - 0.5) * 18,
              vx: b.vx + (m - 1) * 135 + (Math.random() - 0.5) * 80,
              vy: b.vy + (Math.random() - 0.5) * 60,
              omega: (Math.random() - 0.5) * 9,
              radius: Math.max(20, Math.round(b.radius * 0.82)),
              scored: true,
              isSecondarySpawn: true,
              multiSplitDone: true,
              trail: []
            };
            this.activeBodies.push(clone);
          }
        }

        // Partway-down Anti-Gravity levitation / reversal (triggers for ANTI_GRAVITY objects AND for subsequent drops in an active Anti-Gravity Field)
        const hasOwnAntiGrav = effects.includes('ANTI_GRAVITY');
        if ((hasOwnAntiGrav || (antiGravEnv && antiGravEnv.strength > 0)) && !b.antiGravDone && b.y >= this.spawnY + 150) {
          b.antiGravDone = true;
          const fieldRatio = hasOwnAntiGrav ? 1.0 : Math.min(1.0, antiGravEnv.strength / 0.6);
          b.antiGravTimer = 0.58 * (0.45 + 0.55 * fieldRatio);
          b.vy = -150 * fieldRatio;
          const label = hasOwnAntiGrav
            ? '🛸 ANTI-GRAVITY!'
            : `🛸 ANTI-GRAV FIELD (${Math.round(this.getGravityMultiplier() * 100)}% G)!`;
          this._spawnFloatingText(b.x, b.y - 28, label, '#2dd4bf');
        }

        // Glitch Zone environmental jitter during fall
        if (glitchEnv && Math.random() < 0.08 * glitchEnv.strength) {
          b.x = Math.max(24, Math.min(this.width - 24, b.x + (Math.random() - 0.5) * 18));
        }

        if (b.antiGravTimer > 0) {
          const fieldRatio = hasOwnAntiGrav ? 1.0 : (antiGravEnv ? Math.min(1.0, antiGravEnv.strength / 0.6) : 1.0);
          b.antiGravTimer -= dt;
          b.vy -= 260 * fieldRatio * dt;
          b.omega += 4 * dt;
        } else {
          b.vy += g * dt;
        }

        // Motion trail
        if (Math.hypot(b.vx, b.vy) > 120) {
          b.trail.push({ x: b.x, y: b.y, angle: b.angle, alpha: 0.35 });
          if (b.trail.length > 6) b.trail.shift();
        }
        for (const t of b.trail) t.alpha *= 0.85;

        // Relax squash & stretch
        b.scaleX += (1 - b.scaleX) * Math.min(1, dt * 14);
        b.scaleY += (1 - b.scaleY) * Math.min(1, dt * 14);

        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.angle += b.omega * dt;

        // Ceiling collision (for MEGA_BOUNCE / SPRING_LAUNCH)
        if (b.y - b.radius < 16 && b.vy < 0) {
          b.y = 16 + b.radius;
          b.vy = Math.abs(b.vy) * 0.78;
          b.scaleX = 1.42;
          b.scaleY = 0.62;
          this._spawnFloatingText(b.x, 42, '💥 CEILING SMASH!', '#4ade80');
          this._spawnBurstParticles(b.x, 18, obj.shardColors, 14, 220);
        }

        // Side wall collisions (RICOCHET boosts lateral speed!)
        const wallRest = effects.includes('RICOCHET') ? 1.04 : 0.84;
        if (b.x - b.radius < 14) {
          b.x = 14 + b.radius;
          b.vx = Math.min(760, Math.abs(b.vx) * wallRest + (effects.includes('RICOCHET') ? 90 : 0));
          b.omega = -b.omega * 0.95;
          if (Math.abs(b.vx) > 120) {
            this._spawnFloatingText(b.x + 28, b.y, 'RICOCHET!', '#facc15');
            this._spawnBurstParticles(14, b.y, ['#facc15', '#ffffff'], 8, 160);
          }
        } else if (b.x + b.radius > this.width - 14) {
          b.x = this.width - 14 - b.radius;
          b.vx = -Math.min(760, Math.abs(b.vx) * wallRest + (effects.includes('RICOCHET') ? 90 : 0));
          b.omega = -b.omega * 0.95;
          if (Math.abs(b.vx) > 120) {
            this._spawnFloatingText(b.x - 28, b.y, 'RICOCHET!', '#facc15');
            this._spawnBurstParticles(this.width - 14, b.y, ['#facc15', '#ffffff'], 8, 160);
          }
        }

        // Floor impact check
        if (b.y + b.radius >= this.floorY) {
          b.y = this.floorY - b.radius;
          const impactSpeed = Math.hypot(b.vx * 0.35, b.vy);
          const variance = Math.round((Math.random() - 0.35) * 8);
          const impactForce = computeImpactForce(impactSpeed, obj, this.slamBoost, variance);

          const isSuperBouncer =
            Boolean(megaBounceEnv) ||
            effects.includes('MEGA_BOUNCE') ||
            effects.includes('SPRING_LAUNCH') ||
            (effects.includes('BOUNCE') && obj.fragility > 120);

          const didBreak = isSuperBouncer && b.bounces < 2
            ? false
            : obj.fragility < impactForce;

          if (slipperyEnv && !didBreak) {
            b.vx += (b.vx >= 0 ? 1 : -1) * (240 * slipperyEnv.strength);
          }

          if (!b.scored) {
            b.scored = true;
            this._handlePrimaryImpact(b, impactForce, didBreak);
            if (didBreak) {
              this.activeBodies.splice(bIdx, 1);
              continue;
            }
          } else if (b.isSecondarySpawn && b.bounces === 0) {
            // Secondary spawned / multi-dropped item hitting the floor
            b.bounces += 1;
            this._triggerEffectsForBody(b, impactForce, didBreak, true);
            if (didBreak) {
              this.activeBodies.splice(bIdx, 1);
              continue;
            }
          } else {
            // Subsequent bounce impacts for surviving objects
            b.bounces += 1;
            if ((isSuperBouncer || effects.includes('BOUNCE')) && b.bounces <= 5 && Math.abs(b.vy) > 110) {
              const bounceMult = effects.includes('MEGA_BOUNCE') ? 1.02 : Math.max(0.58, obj.restitution - b.bounces * 0.08);
              b.vy = -Math.min(960, Math.abs(b.vy) * bounceMult);
              b.vx += (Math.random() - 0.5) * 280;
              b.omega = (Math.random() - 0.5) * 10;
              b.scaleX = 1.48;
              b.scaleY = 0.55;

              const word = effects.includes('MEGA_BOUNCE') ? 'MEGA BOING!' : 'BOING!';
              this._spawnFloatingText(b.x, this.floorY - 38, word, obj.primaryColor);
              this._spawnBurstParticles(b.x, this.floorY, obj.shardColors, 10, 180);

              if (typeof this.callbacks.onBounce === 'function') {
                this.callbacks.onBounce(obj, b.bounces);
              }
            } else {
              if (Math.abs(b.vy) > 75) {
                b.vy = -Math.abs(b.vy) * 0.35;
                b.vx *= 0.7;
                b.omega *= 0.65;
              } else {
                b.vy = 0;
                b.vx *= 0.8;
                b.omega *= 0.7;
                if (Math.abs(b.vx) < 10 && Math.abs(b.omega) < 0.25) {
                  b.settledTimer += dt;
                  if (b.settledTimer > 0.45) {
                    this.activeBodies.splice(bIdx, 1);
                  }
                }
              }
            }
          }
        }
      }

      // 2. Update Shards, Gold Coins & Rubber Ducks
      for (const s of this.shards) {
        if (s.asleep) continue;
        s.vy += g * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.angle += s.omega * dt;

        if (s.x - s.size < 10) {
          s.x = 10 + s.size;
          s.vx = Math.abs(s.vx) * 0.7;
        } else if (s.x + s.size > this.width - 10) {
          s.x = this.width - 10 - s.size;
          s.vx = -Math.abs(s.vx) * 0.7;
        }

        if (s.y + s.size * 0.65 >= this.floorY) {
          s.y = this.floorY - s.size * 0.65;
          const floorFriction = slipperyEnv ? 0.985 : 0.82;
          if (Math.abs(s.vy) > 60) {
            s.vy = -Math.abs(s.vy) * s.restitution;
            s.vx *= slipperyEnv ? 0.98 : 0.8;
            s.omega *= 0.75;
          } else {
            s.vy = 0;
            s.vx *= floorFriction;
            s.omega *= 0.6;
            if (!antiGravEnv && Math.abs(s.vx) < 6 && Math.abs(s.omega) < 0.15) {
              s.asleep = true;
            }
          }
        }
      }

      // 3. Update Particles (Sparks, Confetti, Droplets)
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        if (p.isConfetti) {
          p.vx += Math.sin(p.life * 16 + p.phase) * 18 * dt;
          p.angle = (p.angle || 0) + 8 * dt;
        }
        if (p.gravity) {
          p.vy += g * p.gravityScale * dt;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.y >= this.floorY) {
          p.y = this.floorY;
          if (p.isDroplet && this.splatterDecals.length < 95) {
            this.splatterDecals.push({
              x: p.x,
              y: this.floorY + (Math.random() - 0.5) * 6,
              rx: p.size * (1.8 + Math.random() * 1.4),
              ry: p.size * (0.45 + Math.random() * 0.35),
              color: p.color
            });
            this.particles.splice(i, 1);
            continue;
          }
          p.vy = -Math.abs(p.vy) * 0.4;
          p.vx *= 0.7;
        }
      }

      // 4. Update Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.radius += sw.speed * dt;
        sw.alpha -= dt * 1.8;
        if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
      }

      // 5. Update Floating Comic Texts
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.life -= dt;
        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }
    }

    /**
     * Trigger all Primary & Secondary Effects for a body on impact!
     */
    _triggerEffectsForBody(body, impactForce, didBreak, isSubImpact = false) {
      const obj = body.object;
      const x = body.x;
      const y = this.floorY;
      const effects = obj.allEffects || [obj.primaryEffect];
      let extraChaosBonus = 0;

      for (const eff of effects) {
        switch (eff) {
          case 'SPLATTER':
            this._spawnSplatterEffect(x, y, obj);
            break;

          case 'EXPLODE':
            this._spawnExplosionEffect(x, y, obj);
            break;

          case 'SHATTER':
            this._spawnBurstParticles(x, y - 10, obj.shardColors, 24, 340);
            this.shakeTime = Math.max(this.shakeTime, 0.22);
            this.shakeMagnitude = Math.max(this.shakeMagnitude, 6);
            break;

          case 'FRAGMENT':
            this._spawnFragmentSwarm(x, y - 14, obj, isSubImpact ? 14 : 28);
            extraChaosBonus += 28 * 6;
            this._spawnFloatingText(x, y - 62, '💥 FRAGMENT SWARM!', '#94a3b8');
            break;

          case 'GOLD_BURST':
            this._spawnGoldBurst(x, y - 14, isSubImpact ? 12 : 24);
            extraChaosBonus += 180;
            this._spawnFloatingText(x, y - 74, '🪙 GOLD BURST! +$$$', '#eab308');
            break;

          case 'DUCK_STORM':
            this._spawnDuckStorm(x, y - 16, isSubImpact ? 7 : 14);
            extraChaosBonus += 14 * 15;
            this._spawnFloatingText(x, y - 82, '🦆 DUCK STORM!', '#facc15');
            break;

          case 'DUCKIFIED':
            this._triggerDuckified(x, y);
            extraChaosBonus += 200;
            break;

          case 'FLOOR_CRACK':
            this._spawnFloorCrack(x, y);
            extraChaosBonus += 95;
            break;

          case 'CONFETTI':
            this._spawnConfettiBurst(x, y - 20, isSubImpact ? 30 : 60);
            extraChaosBonus += 80;
            break;

          case 'SPRING_LAUNCH':
            if (!didBreak && !isSubImpact) {
              body.springHoldTimer = 0.14;
              body.vy = 0;
            }
            break;

          case 'MEGA_BOUNCE':
          case 'BOUNCE':
            if (!didBreak) {
              body.bounces += 1;
              const mult = eff === 'MEGA_BOUNCE' ? 1.12 : 0.96;
              body.vy = -Math.max(660, Math.abs(body.vy) * mult);
              body.vx = (Math.random() - 0.5) * 380 + (body.vx >= 0 ? 110 : -110);
              body.omega = (Math.random() - 0.5) * 12;
              body.scaleX = 1.55;
              body.scaleY = 0.48;
              this._spawnFloatingText(
                x,
                y - 45,
                eff === 'MEGA_BOUNCE' ? '🚀 MEGA BOUNCE!' : 'BOING!',
                obj.primaryColor
              );
            }
            break;

          case 'RICOCHET':
            if (!didBreak) {
              body.vy = -Math.max(520, Math.abs(body.vy) * 0.88);
              body.vx = (Math.random() >= 0.5 ? 1 : -1) * (540 + Math.random() * 220);
            }
            break;

          case 'CHAIN_REACTION':
            if (!isSubImpact) {
              this._scheduleChainReaction(x, y, obj);
              extraChaosBonus += 220;
            }
            break;

          case 'SPAWN_OBJECT':
            if (!isSubImpact) {
              this._spawnSurpriseSecondaryObject(x, y - 28, obj);
              extraChaosBonus += 150;
            }
            break;

          case 'PORTAL':
            if (!isSubImpact) {
              this._spawnPortalPair(x, y - 16);
              extraChaosBonus += 190;
            }
            break;

          case 'BLACK_HOLE':
            if (!isSubImpact) {
              this._spawnBlackHole(x, y - 85);
              extraChaosBonus += 240;
            }
            break;

          case 'MOON_GRAVITY':
            this.moonGravityTimer = 4.5;
            break;

          case 'RAIN_OF_OBJECTS':
            if (!isSubImpact) {
              this._scheduleRainOfObjects();
              extraChaosBonus += 210;
            }
            break;

          case 'GLITCH':
            this._triggerGlitchEffect(x, y);
            extraChaosBonus += 175;
            break;
        }
      }

      if (didBreak) {
        this._spawnBreakageShards(x, y - 16, obj, isSubImpact ? 8 : 15);
      }

      return extraChaosBonus;
    }

    _handlePrimaryImpact(body, impactForce, didBreak) {
      const obj = body.object;
      const effects = obj.allEffects || [obj.primaryEffect];

      // 1. Apply bonus effects from any pre-existing environmental modifiers active during this drop
      let envBonus = 0;
      const activeDuckStorm = this.getEnvironmentalEffect('duckStormActivity');
      if (activeDuckStorm && activeDuckStorm.strength > 0) {
        const duckCount = Math.max(3, Math.round(8 * activeDuckStorm.strength));
        this._spawnDuckStorm(body.x, this.floorY - 16, duckCount);
        envBonus += duckCount * 15;
      }
      const activeGlitch = this.getEnvironmentalEffect('glitchZone');
      if (activeGlitch && activeGlitch.strength > 0) {
        this.glitchTimer = Math.max(this.glitchTimer, 0.45 * activeGlitch.strength);
        envBonus += 60;
      }

      // 2. Decay pre-existing environmental effects now that this subsequent drop has completed
      this.decayEnvironmentalEffectsAfterDrop();

      // 3. Trigger this object's own impact effects
      const extraEffectBonus = this._triggerEffectsForBody(body, impactForce, didBreak, false) + envBonus;

      const scoreData = DropObjects.calculateChaosScore({
        object: obj,
        impactForce,
        didBreak,
        extraEffectBonus
      });

      const taunt = DropObjects.getRandomTaunt(obj.id, obj.allEffects);

      if (typeof this.callbacks.onImpact === 'function') {
        this.callbacks.onImpact({
          ...scoreData,
          taunt,
          activeEnvironmentalEffects: this.getActiveEffects()
        });
      }

      // 4. Activate post-drop environmental effects for FUTURE drops!
      if (effects.includes('ANTI_GRAVITY')) {
        this.activateEnvironmentalEffect('antiGravity');
      }
      if (obj.id === 'banana_crate' || (effects.includes('SPLATTER') && effects.includes('RICOCHET'))) {
        this.activateEnvironmentalEffect('slipperyFloor');
      }
      if (effects.includes('MOON_GRAVITY')) {
        this.activateEnvironmentalEffect('moonGravity');
      }
      if (effects.includes('DUCK_STORM') || effects.includes('DUCKIFIED')) {
        this.activateEnvironmentalEffect('duckStormActivity');
      }
      if (effects.includes('GLITCH')) {
        this.activateEnvironmentalEffect('glitchZone');
      }
      if (obj.id === 'trampoline' || obj.id === 'spring_mattress') {
        this.activateEnvironmentalEffect('megaBounce');
      }
    }

    _spawnGoldBurst(x, y, count = 24) {
      if (this.shards.length > 75) this.shards.splice(0, count);
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * (0.1 + 0.8 * Math.random());
        const speed = 180 + Math.random() * 380;
        const isBar = i % 4 === 0;
        this.shards.push({
          x: x + (Math.random() - 0.5) * 20,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 90,
          angle: Math.random() * Math.PI * 2,
          omega: (Math.random() - 0.5) * 16,
          size: isBar ? 11 : 8,
          color: isBar ? '#eab308' : '#facc15',
          borderColor: '#713f12',
          shapeType: isBar ? 'gold_bar' : 'gold_coin',
          restitution: 0.62,
          asleep: false
        });
      }
    }

    _spawnDuckStorm(x, y, count = 14) {
      if (this.shards.length > 75) this.shards.splice(0, count);
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * (0.08 + 0.84 * Math.random());
        const speed = 200 + Math.random() * 420;
        this.shards.push({
          x: x + (Math.random() - 0.5) * 28,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 110,
          angle: (Math.random() - 0.5) * 0.6,
          omega: (Math.random() - 0.5) * 10,
          size: 11 + Math.random() * 4,
          color: '#facc15',
          borderColor: '#854d0e',
          shapeType: 'duck',
          restitution: 0.84,
          asleep: false
        });
      }
    }

    _triggerDuckified(x, y) {
      this.shockwaves.push({
        x,
        y: y - 10,
        radius: 10,
        speed: 480,
        alpha: 1.0,
        color: '#facc15'
      });
      this._spawnFloatingText(x, y - 92, '🦆 DUCKIFIED DEBRIS!', '#facc15');

      // Transform all existing shards into bouncing rubber ducks!
      if (this.shards.length === 0) {
        this._spawnDuckStorm(x, y - 16, 10);
      } else {
        for (const s of this.shards) {
          s.shapeType = 'duck';
          s.color = '#facc15';
          s.size = 12;
          s.restitution = 0.85;
          s.asleep = false;
          s.vy = -220 - Math.random() * 280;
          s.vx = (Math.random() - 0.5) * 320;
        }
      }
    }

    _spawnFloorCrack(x, y) {
      if (this.floorCracks.length > 25) this.floorCracks.shift();
      const branches = [];
      const branchCount = 4 + Math.floor(Math.random() * 3);
      for (let b = 0; b < branchCount; b++) {
        const pts = [{ x, y: y + 2 }];
        let cx = x;
        let cy = y + 2;
        const dirX = (b / (branchCount - 1) - 0.5) * 2.2;
        const segments = 4 + Math.floor(Math.random() * 3);
        for (let s = 0; s < segments; s++) {
          cx += dirX * (12 + Math.random() * 14) + (Math.random() - 0.5) * 10;
          cy += 5 + Math.random() * 8;
          pts.push({
            x: Math.max(12, Math.min(this.width - 12, cx)),
            y: Math.min(this.height - 6, cy)
          });
        }
        branches.push(pts);
      }
      this.floorCracks.push({ x, y, branches });
    }

    _spawnConfettiBurst(x, y, count = 60) {
      const colors = ['#ec4899', '#facc15', '#38bdf8', '#4ade80', '#a855f7', '#f97316'];
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * Math.random();
        const speed = 140 + Math.random() * 380;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 120,
          size: 5 + Math.random() * 4,
          color: colors[i % colors.length],
          life: 1.1 + Math.random() * 0.7,
          maxLife: 1.8,
          gravity: true,
          gravityScale: 0.28,
          isConfetti: true,
          phase: Math.random() * Math.PI * 2,
          angle: Math.random() * Math.PI * 2
        });
      }
    }

    _spawnFragmentSwarm(x, y, obj, count = 28) {
      if (this.shards.length > 80) this.shards.splice(0, count);
      const palette = obj.shardColors || ['#94a3b8', '#cbd5e1', '#facc15'];
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * Math.random();
        const speed = 160 + Math.random() * 420;
        this.shards.push({
          x: x + (Math.random() - 0.5) * 20,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 80,
          angle: Math.random() * Math.PI * 2,
          omega: (Math.random() - 0.5) * 18,
          size: 4.5 + Math.random() * 5,
          color: palette[i % palette.length],
          borderColor: '#0f172a',
          shapeType: 'polygon',
          restitution: 0.48,
          asleep: false
        });
      }
    }

    _scheduleChainReaction(x, y, obj) {
      this._spawnFloatingText(x, y - 70, '🧨 CHAIN REACTION!', '#ef4444');
      for (let i = 1; i <= 4; i++) {
        this.scheduledEvents.push({
          delay: i * 0.19,
          fn: () => {
            const bx = Math.max(48, Math.min(this.width - 48, x + (Math.random() - 0.5) * 220));
            this._spawnExplosionEffect(bx, this.floorY, obj);
            this._spawnFloatingText(bx, this.floorY - 45, `BOOM #${i + 1}!`, '#f97316');
            if (typeof this.callbacks.onBounce === 'function') {
              this.callbacks.onBounce(obj, i);
            }
          }
        });
      }
    }

    _spawnSurpriseSecondaryObject(x, y, parentObj) {
      const surprisePool = ['anvil', 'rubber_duck', 'gold_chest', 'giant_donut', 'watermelon', 'bowling_ball'];
      const chosenId = surprisePool[Math.floor(Math.random() * surprisePool.length)];
      const surpriseObj = DropObjects.getObjectById(chosenId) || DropObjects.getRandomObject();

      this._spawnFloatingText(x, y - 50, `🎁 SPAWNED: ${surpriseObj.shortName.toUpperCase()}!`, '#c084fc');

      const child = this.dropObject(surpriseObj.id, x + (Math.random() - 0.5) * 50, true);
      child.y = y - 20;
      child.vy = -440;
      child.vx = (Math.random() - 0.5) * 240;
    }

    _spawnPortalPair(x, y) {
      const topX = Math.max(70, Math.min(this.width - 70, this.width / 2 + (Math.random() - 0.5) * 140));
      const topY = this.spawnY + 18;

      this.portals.push({ x, y, radius: 38, color1: '#f97316', color2: '#fde047', life: 1.4, angle: 0 });
      this.portals.push({ x: topX, y: topY, radius: 38, color1: '#0ea5e9', color2: '#a855f7', life: 1.4, angle: 0 });

      this._spawnFloatingText(topX, topY + 42, '🌀 PORTAL DROP!', '#38bdf8');
      const emerged = DropObjects.getRandomObject();
      const b = this.dropObject(emerged.id, topX, true);
      b.vy = 280;
    }

    _spawnBlackHole(x, y) {
      this.blackHoles.push({
        x,
        y,
        radius: 36,
        life: 1.65,
        angle: 0
      });
      this._spawnFloatingText(x, y - 48, '🕳️ SINGULARITY!', '#818cf8');
    }

    _scheduleRainOfObjects() {
      this._spawnFloatingText(this.width / 2, this.spawnY + 35, '☔ RAIN OF OBJECTS!', '#34d399');
      for (let i = 0; i < 6; i++) {
        this.scheduledEvents.push({
          delay: i * 0.14,
          fn: () => {
            const rnd = DropObjects.getRandomObject();
            const rx = 45 + Math.random() * (this.width - 90);
            const b = this.dropObject(rnd.id, rx, true);
            b.radius = Math.max(18, Math.round(b.radius * 0.72));
            b.vy = 160;
          }
        });
      }
    }

    _triggerGlitchEffect(x, y) {
      this.glitchTimer = 1.15;
      this.shakeTime = 0.45;
      this.shakeMagnitude = 12;

      const msgs = [
        'ERR_GRAVITY_OVERFLOW: Task failed successfully',
        '404 FLOOR_INTEGRITY_NOT_FOUND',
        'REALITY.EXE encountered a fatal Physics Exception'
      ];
      this.glitchPopups = [
        {
          x: Math.max(40, Math.min(this.width - 240, x - 90)),
          y: Math.max(70, y - 180),
          title: 'SYSTEM_GLITCH.SYS',
          text: msgs[Math.floor(Math.random() * msgs.length)]
        }
      ];
    }

    _spawnSplatterEffect(x, y, obj) {
      const palette = obj.splatterColors || obj.shardColors;
      this.shakeTime = Math.max(this.shakeTime, 0.18);
      this.shakeMagnitude = Math.max(this.shakeMagnitude, 5);

      if (this.splatterDecals.length > 75) {
        this.splatterDecals.splice(0, 20);
      }

      for (let i = 0; i < 11; i++) {
        const offsetX = (Math.random() - 0.5) * 115;
        const offsetY = (Math.random() - 0.3) * 16;
        const rx = 14 + Math.random() * 28;
        const ry = 4 + Math.random() * 8;
        this.splatterDecals.push({
          x: Math.max(24, Math.min(this.width - 24, x + offsetX)),
          y: y + offsetY,
          rx,
          ry,
          color: palette[i % palette.length],
          seedDot: obj.id.includes('melon') && i % 3 === 0,
          yolkCenter: obj.id === 'giant_egg' && i === 0
        });
      }

      for (let i = 0; i < 32; i++) {
        const angle = -Math.PI * (0.1 + Math.random() * 0.8);
        const speed = 120 + Math.random() * 360;
        this.particles.push({
          x,
          y: y - 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 60,
          size: 3.5 + Math.random() * 5,
          color: palette[i % palette.length],
          life: 0.65 + Math.random() * 0.45,
          maxLife: 1.1,
          gravity: true,
          gravityScale: 0.85,
          isDroplet: true
        });
      }
    }

    _spawnExplosionEffect(x, y, obj) {
      this.shakeTime = Math.max(this.shakeTime, 0.38);
      this.shakeMagnitude = Math.max(this.shakeMagnitude, 12);

      this.shockwaves.push({
        x,
        y: y - 12,
        radius: 12,
        speed: 440,
        alpha: 1.0,
        color: obj.accentColor || '#facc15'
      });
      this.shockwaves.push({
        x,
        y: y - 12,
        radius: 6,
        speed: 280,
        alpha: 0.85,
        color: '#ef4444'
      });

      this.splatterDecals.push({
        x,
        y: y + 2,
        rx: 44,
        ry: 8,
        color: '#1e293b',
        isCrater: true
      });

      const burstColors = ['#facc15', '#f97316', '#ef4444', '#fde047', '#ffffff', obj.primaryColor];
      for (let i = 0; i < 46; i++) {
        const angle = -Math.PI * Math.random();
        const speed = 150 + Math.random() * 460;
        this.particles.push({
          x,
          y: y - 14,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 90,
          size: 4 + Math.random() * 6.5,
          color: burstColors[i % burstColors.length],
          life: 0.45 + Math.random() * 0.5,
          maxLife: 0.95,
          gravity: true,
          gravityScale: 0.55,
          isSpark: true
        });
      }
    }

    _spawnBurstParticles(x, y, palette, count = 20, maxSpeed = 280) {
      const colors = Array.isArray(palette) && palette.length ? palette : ['#facc15', '#ef4444'];
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * Math.random();
        const speed = 70 + Math.random() * maxSpeed;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 40,
          size: 3 + Math.random() * 4.5,
          color: colors[i % colors.length],
          life: 0.4 + Math.random() * 0.45,
          maxLife: 0.85,
          gravity: true,
          gravityScale: 0.75
        });
      }
    }

    _spawnBreakageShards(x, y, obj, shardCount = 14) {
      if (this.shards.length > 75) {
        this.shards.splice(0, shardCount);
      }
      const palette = obj.shardColors || [obj.primaryColor, obj.secondaryColor];

      for (let i = 0; i < shardCount; i++) {
        const spreadAngle = -Math.PI * (0.08 + 0.84 * (i / Math.max(1, shardCount - 1))) + (Math.random() - 0.5) * 0.25;
        const speed = 130 + Math.random() * 340;
        let shapeType = 'polygon';
        if (obj.id === 'piano' && i % 3 === 0) shapeType = 'piano_key';
        if (obj.id.includes('toaster') && i < 3) shapeType = 'toast_slice';

        this.shards.push({
          x: x + (Math.random() - 0.5) * 24,
          y: y - Math.random() * 16,
          vx: Math.cos(spreadAngle) * speed,
          vy: Math.sin(spreadAngle) * speed - 70,
          angle: Math.random() * Math.PI * 2,
          omega: (Math.random() - 0.5) * 15,
          size: 7 + Math.random() * 8,
          color: palette[i % palette.length],
          borderColor: '#0f172a',
          shapeType,
          restitution: 0.38 + Math.random() * 0.24,
          asleep: false
        });
      }
    }

    _spawnFloatingText(x, y, text, color = '#facc15') {
      if (this.floatingTexts.length > 10) this.floatingTexts.shift();
      this.floatingTexts.push({
        x: Math.max(70, Math.min(this.width - 70, x)),
        y,
        vy: -72,
        text,
        color,
        life: 0.95,
        maxLife: 0.95
      });
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const isRetro = this.mode === 'retro';

      ctx.save();

      if (this.shakeTime > 0) {
        const dx = (Math.random() - 0.5) * 2 * this.shakeMagnitude;
        const dy = (Math.random() - 0.5) * 2 * this.shakeMagnitude;
        ctx.translate(dx, dy);
      }

      const antiGravEnv = this.getEnvironmentalEffect('antiGravity');
      const moonGravEnv = this.getEnvironmentalEffect('moonGravity');
      const slipperyEnv = this.getEnvironmentalEffect('slipperyFloor');

      // 1. Background
      if (isRetro) {
        ctx.fillStyle = '#071407';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.strokeStyle = 'rgba(51, 255, 51, 0.08)';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < this.width; gx += 24) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, this.floorY);
          ctx.stroke();
        }
        for (let gy = 0; gy < this.floorY; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(this.width, gy);
          ctx.stroke();
        }
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, this.height);
        if (this.moonGravityTimer > 0 || moonGravEnv) {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.7, '#1e293b');
          grad.addColorStop(1, '#334155');
        } else if (antiGravEnv) {
          grad.addColorStop(0, '#ccfbf1');
          grad.addColorStop(0.6, '#e0f2fe');
          grad.addColorStop(1, '#f3e8ff');
        } else {
          grad.addColorStop(0, '#e0f2fe');
          grad.addColorStop(0.65, '#f0f9ff');
          grad.addColorStop(1, '#fef9c3');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);
      }

      // Subtle screen effect indicating altered gravity when Anti-Gravity Field is active
      if (antiGravEnv) {
        ctx.save();
        const pulseAlpha = (0.22 + 0.14 * Math.sin(this._ambientPulsePhase * 2)) * (0.4 + antiGravEnv.strength);
        ctx.strokeStyle = isRetro ? '#33ff33' : `rgba(45, 212, 191, ${pulseAlpha.toFixed(2)})`;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, this.width - 6, this.floorY - 6);
        const gravPct = Math.round(this.getGravityMultiplier() * 100);
        ctx.fillStyle = isRetro ? '#071407' : 'rgba(15, 23, 42, 0.78)';
        ctx.fillRect(this.width / 2 - 115, 20, 230, 20);
        ctx.fillStyle = isRetro ? '#33ff33' : '#2dd4bf';
        ctx.font = isRetro ? '8px "Press Start 2P", monospace' : '800 10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🛸 ANTI-GRAVITY: ${gravPct}% NORMAL GRAVITY`, this.width / 2, 34);
        ctx.restore();
      }

      // 2. Height Ruler
      ctx.font = isRetro ? 'bold 12px "Press Start 2P", monospace' : '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isRetro ? 'rgba(51, 255, 51, 0.55)' : (this.moonGravityTimer > 0 ? '#94a3b8' : 'rgba(71, 85, 105, 0.55)');
      const usableHeight = this.floorY - this.spawnY;
      for (let m = 10; m >= 2; m -= 2) {
        const ry = this.floorY - (m / 10) * usableHeight;
        ctx.fillRect(10, ry, 10, 2);
        ctx.fillText(`${m}m`, 24, ry + 4);
      }

      // 3. Top-Center Drop Chute
      const centerX = this.width / 2;
      ctx.strokeStyle = isRetro ? '#33ff33' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, 14);
      ctx.lineTo(centerX, 90);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isRetro ? '#0f290f' : '#1e293b';
      ctx.fillRect(centerX - 42, 0, 84, 15);
      ctx.fillStyle = isRetro ? '#33ff33' : '#facc15';
      ctx.font = isRetro ? '9px "Press Start 2P", monospace' : '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DROP CHUTE', centerX, 11);

      // 4. Floor & Hazard Stripes
      ctx.fillStyle = isRetro ? '#0c260c' : '#cbd5e1';
      ctx.fillRect(0, this.floorY, this.width, this.height - this.floorY);

      ctx.fillStyle = isRetro ? '#33ff33' : (slipperyEnv ? '#facc15' : '#334155');
      ctx.fillRect(0, this.floorY - 3, this.width, 5);

      // Render Persistent FLOOR_CRACK jagged lines
      ctx.strokeStyle = isRetro ? '#33ff33' : '#0f172a';
      ctx.lineWidth = 2.5;
      for (const fc of this.floorCracks) {
        for (const branch of fc.branches) {
          ctx.beginPath();
          branch.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();
        }
      }

      // Hazard Stripes
      const stripeY = this.height - 16;
      ctx.fillStyle = isRetro ? '#194d19' : '#facc15';
      ctx.fillRect(0, stripeY, this.width, 16);
      ctx.fillStyle = isRetro ? '#040b04' : '#0f172a';
      for (let sx = -16; sx < this.width + 16; sx += 28) {
        ctx.beginPath();
        ctx.moveTo(sx, stripeY);
        ctx.lineTo(sx + 14, stripeY);
        ctx.lineTo(sx + 6, this.height);
        ctx.lineTo(sx - 8, this.height);
        ctx.closePath();
        ctx.fill();
      }

      // 5. Render Splatter Decals
      for (const d of this.splatterDecals) {
        ctx.save();
        ctx.fillStyle = d.color;
        if (isRetro) {
          const w = Math.round(d.rx * 1.8);
          const h = Math.round(d.ry * 1.8);
          ctx.fillRect(Math.round(d.x - w / 2), Math.round(d.y - h / 2), w, h);
        } else {
          ctx.beginPath();
          ctx.ellipse(d.x, d.y, d.rx, d.ry, 0, 0, Math.PI * 2);
          ctx.fill();
          if (d.yolkCenter) {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.ellipse(d.x, d.y - 1, d.rx * 0.48, d.ry * 0.65, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 6. Render Swirling Portals
      for (const pt of this.portals) {
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.angle);
        ctx.strokeStyle = isRetro ? '#33ff33' : pt.color1;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, pt.radius, pt.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = isRetro ? '#22cc22' : pt.color2;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, pt.radius * 0.65, pt.radius * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 7. Render Black Holes
      for (const bh of this.blackHoles) {
        ctx.save();
        ctx.translate(bh.x, bh.y);
        ctx.rotate(bh.angle);
        ctx.strokeStyle = isRetro ? '#33ff33' : '#818cf8';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, bh.radius * 1.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(0, 0, bh.radius * 0.78, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // 8. Render Shockwaves
      for (const sw of this.shockwaves) {
        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = isRetro ? 4 : 5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 9. Render Shards, Gold Coins, Gold Bars, and Rubber Ducks
      for (const s of this.shards) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);

        if (s.shapeType === 'duck') {
          // Bouncing yellow rubber duck!
          ctx.fillStyle = isRetro ? '#33ff33' : '#facc15';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 2, s.size * 0.75, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(s.size * 0.45, -s.size * 0.45, s.size * 0.48, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#f97316';
          ctx.fillRect(s.size * 0.75, -s.size * 0.55, s.size * 0.45, s.size * 0.28);
        } else if (s.shapeType === 'gold_coin') {
          ctx.fillStyle = isRetro ? '#33ff33' : '#facc15';
          ctx.strokeStyle = '#854d0e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (s.shapeType === 'gold_bar') {
          ctx.fillStyle = isRetro ? '#33ff33' : '#eab308';
          ctx.strokeStyle = '#713f12';
          ctx.lineWidth = 2;
          ctx.fillRect(-s.size, -s.size * 0.55, s.size * 2, s.size * 1.1);
          ctx.strokeRect(-s.size, -s.size * 0.55, s.size * 2, s.size * 1.1);
        } else {
          ctx.fillStyle = s.color;
          ctx.strokeStyle = isRetro ? '#33ff33' : s.borderColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-s.size, -s.size * 0.6);
          ctx.lineTo(s.size * 0.8, -s.size * 0.9);
          ctx.lineTo(s.size, s.size * 0.7);
          ctx.lineTo(-s.size * 0.5, s.size * 0.8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // 10. Render Active Falling / Bouncing Bodies
      for (const b of this.activeBodies) {
        const obj = b.object;
        const img = this.imageCache[this.mode] && this.imageCache[this.mode][obj.id];

        // Anti-gravity field aura on active body
        if (b.antiGravTimer > 0 || antiGravEnv) {
          ctx.save();
          ctx.strokeStyle = '#2dd4bf';
          ctx.globalAlpha = b.antiGravTimer > 0 ? 0.9 : 0.45;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * 1.32, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Motion trail
        for (const t of b.trail) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, t.alpha * 0.4);
          ctx.translate(t.x, t.y);
          ctx.rotate(t.angle);
          ctx.fillStyle = obj.primaryColor;
          ctx.beginPath();
          ctx.arc(0, 0, b.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.scale(b.scaleX, b.scaleY);

        const drawSize = b.radius * 2.25;
        if (isRetro) ctx.imageSmoothingEnabled = false;
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        } else {
          ctx.fillStyle = obj.primaryColor;
          ctx.beginPath();
          ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 11. Render Particles & Confetti
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));
        ctx.fillStyle = p.color;
        if (p.isConfetti) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);
          ctx.fillRect(-p.size, -p.size * 0.45, p.size * 2, p.size * 0.9);
        } else if (isRetro || p.isSpark) {
          const s = Math.round(p.size);
          ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), s, s);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 12. Render GLITCH Overlay & Fake Error Dialogs
      if (this.glitchTimer > 0) {
        for (let g = 0; g < 6; g++) {
          const gy = Math.random() * this.height;
          const gh = 6 + Math.random() * 18;
          ctx.fillStyle = g % 2 === 0 ? 'rgba(34, 211, 238, 0.28)' : 'rgba(244, 63, 94, 0.28)';
          ctx.fillRect(0, gy, this.width, gh);
        }
        for (const pop of this.glitchPopups) {
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 2.5;
          ctx.fillRect(pop.x, pop.y, 240, 58);
          ctx.strokeRect(pop.x, pop.y, 240, 58);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(pop.x, pop.y, 240, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`⚠ ${pop.title}`, pop.x + 6, pop.y + 13);
          ctx.fillStyle = '#22d3ee';
          ctx.fillText(pop.text.slice(0, 34), pop.x + 6, pop.y + 38);
        }
      }

      // 13. Render Floating Comic Texts
      for (const ft of this.floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
        ctx.font = isRetro
          ? 'bold 12px "Press Start 2P", monospace'
          : '900 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.lineWidth = 4;
        ctx.strokeStyle = isRetro ? '#040b04' : '#0f172a';
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = isRetro ? '#33ff33' : ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();
    }
  }

  return {
    GRAVITY,
    ENVIRONMENTAL_EFFECT_DEFS,
    computeImpactForce,
    simulateDropOutcome,
    DropWorld
  };
});
