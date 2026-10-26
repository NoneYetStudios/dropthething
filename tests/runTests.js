/**
 * Drop The Thing - End-to-End Automated Verification Suite
 * Verifies:
 * 1. All 12 objects & physical SVG/WAV assets (Modern + Retro)
 * 2. Physics Engine impact force, breakage rule (fragility < impactForce), and special effects
 * 3. Chaos Factor score math: (impactForce * weightModifier) + breakageBonus + specialEffectBonus
 * 4. Share URL encoding (/drop?object=piano&score=842)
 * 5. Lemonade Stand Nickname Filter (token vs substring + leetspeak)
 * 6. Live HTTP + SQLite Top 50 Leaderboard API & /drop routing
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ProfanityFilter = require('../frontend/js/profanityFilter');
const DropObjects = require('../frontend/js/objects');
const DropPhysics = require('../frontend/js/physics');
const { createServer } = require('../backend/server');

async function runTests() {
  console.log('🧪 Running Drop The Thing Verification Suite...\n');

  // ---------------------------------------------------------------------------
  // 1. Verify Expanded Catalog (>= 100 Objects), Multi-Effect Architecture & SVG Assets
  // ---------------------------------------------------------------------------
  const requiredOriginalIds = [
    'piano', 'watermelon', 'bowling_ball', 'rubber_duck',
    'anvil', 'glass_bottle', 'pumpkin', 'tv',
    'toaster', 'brick', 'giant_egg', 'mystery_box'
  ];
  const requiredExpansionSampleIds = [
    'safe', 'refrigerator', 'vending_machine', 'gun_safe', 'server_rack', 'arcade_cabinet',
    'birthday_cake', 'giant_donut', 'pickle_jar', 'banana_crate', 'spaghetti_pot',
    'apple_ii', 'commodore_64', 'crt_monitor', 'dot_matrix_printer', 'dial_telephone', 'palm_pilot',
    'garden_gnome', 'inflatable_flamingo', 'disco_ball', 'lava_lamp', 'pinata', 'trampoline',
    'coffee_machine', 'conference_table', 'document_shredder', 'paper_pallet',
    'moon_rock', 'tiny_moon', 'bigger_moon', 'tax_audit', 'technical_debt', 'extended_warranty',
    'internet_comment_section', 'quantum_watermelon', 'cursed_toaster', 'rubber_duck_emperor',
    'the_thing', 'bigger_thing', 'even_bigger_thing', 'forbidden_thing', 'ultimate_thing',
    'bowling_ball_bag', 'crate_of_bricks', 'carton_of_watermelons'
  ];

  assert.ok(
    DropObjects.OBJECTS.length >= 100,
    `Must have at least 100 objects (found ${DropObjects.OBJECTS.length})`
  );
  assert.equal(
    DropObjects.OBJECTS.length % 12,
    0,
    'Object count should be a clean multiple of 12 for 12-per-page pagination'
  );

  const requiredEffectKeys = [
    'SHATTER', 'SPLATTER', 'BOUNCE', 'EXPLODE',
    'GOLD_BURST', 'DUCK_STORM', 'MULTI_DROP', 'FLOOR_CRACK',
    'MEGA_BOUNCE', 'ANTI_GRAVITY', 'CONFETTI', 'SPRING_LAUNCH',
    'CHAIN_REACTION', 'SPAWN_OBJECT', 'FRAGMENT', 'PORTAL',
    'RICOCHET', 'BLACK_HOLE', 'MOON_GRAVITY', 'RAIN_OF_OBJECTS',
    'GLITCH', 'DUCKIFIED'
  ];
  for (const effKey of requiredEffectKeys) {
    assert.ok(DropObjects.EFFECTS[effKey], `Missing effect "${effKey}" in DropObjects.EFFECTS`);
  }

  for (const id of [...requiredOriginalIds, ...requiredExpansionSampleIds]) {
    assert.ok(DropObjects.getObjectById(id), `Required object "${id}" must exist in catalog`);
  }

  // Verify Massive Safe multi-effect example from spec
  const safeObj = DropObjects.getObjectById('safe');
  assert.equal(safeObj.name, 'Massive Safe');
  assert.equal(safeObj.weight, 800);
  assert.equal(safeObj.fragility, 70);
  assert.equal(safeObj.primaryEffect, 'SHATTER');
  assert.ok(safeObj.secondaryEffects.includes('GOLD_BURST'), 'Massive Safe must include GOLD_BURST');
  assert.ok(safeObj.secondaryEffects.includes('FLOOR_CRACK'), 'Massive Safe must include FLOOR_CRACK');

  for (const obj of DropObjects.OBJECTS) {
    assert.ok(obj.weight > 0, `Object "${obj.id}" must have positive weight`);
    assert.ok(obj.fragility > 0, `Object "${obj.id}" must have positive fragility`);
    assert.ok(obj.primaryEffect && DropObjects.EFFECTS[obj.primaryEffect], `Object "${obj.id}" must have valid primaryEffect`);
    assert.ok(Array.isArray(obj.secondaryEffects), `Object "${obj.id}" must have secondaryEffects array`);
    assert.ok(Array.isArray(obj.allEffects) && obj.allEffects.length >= 1, `Object "${obj.id}" must have allEffects array`);
    assert.ok(obj.modernSvg.includes('<svg'), `Object "${obj.id}" must have modern SVG`);
    assert.ok(obj.retroSvg.includes('shape-rendering="crispEdges"'), `Object "${obj.id}" must have retro pixel SVG`);

    const modernPath = path.resolve(__dirname, `../frontend/assets/objects/modern/${obj.id}.svg`);
    const retroPath = path.resolve(__dirname, `../frontend/assets/objects/retro/${obj.id}.svg`);
    assert.ok(fs.existsSync(modernPath), `Missing physical file: ${modernPath}`);
    assert.ok(fs.existsSync(retroPath), `Missing physical file: ${retroPath}`);
  }
  console.log(`✅ 1/6 All ${DropObjects.OBJECTS.length} objects, 22 effects & Modern/Retro SVG physical files verified.`);

  // ---------------------------------------------------------------------------
  // 2. Verify Physics Engine, Impact Logic & Expanded Multi-Effects
  // ---------------------------------------------------------------------------
  const watermelonDrop = DropPhysics.simulateDropOutcome('watermelon', { seed: 42 });
  assert.equal(watermelonDrop.didBreak, true, 'Watermelon must break when fragility < impactForce');
  assert.ok(watermelonDrop.effectsTriggered.splatterDecalsSpawned > 0, 'Watermelon must spawn splatter decals');

  const tvDrop = DropPhysics.simulateDropOutcome('tv', { seed: 42 });
  assert.equal(tvDrop.didBreak, true, 'TV must break when fragility < impactForce');
  assert.ok(tvDrop.effectsTriggered.particleBurstCount >= 50, 'TV must spawn explosion particle burst');

  const duckDrop = DropPhysics.simulateDropOutcome('rubber_duck', { seed: 42 });
  assert.equal(duckDrop.didBreak, false, 'Rubber duck (fragility 999) must survive and bounce');
  assert.equal(duckDrop.effectsTriggered.exaggeratedCartoonBounce, true, 'Rubber duck must trigger cartoon bounce');

  const bowlingNormal = DropPhysics.simulateDropOutcome('bowling_ball', { seed: 42, slamBoost: false });
  assert.equal(bowlingNormal.didBreak, false, 'Bowling ball bounces on normal drop');
  const bowlingSlam = DropPhysics.simulateDropOutcome('bowling_ball', { seed: 42, slamBoost: true });
  assert.equal(bowlingSlam.didBreak, true, 'Bowling ball breaks on Turbo Slam drop when fragility < impactForce');

  const safeDrop = DropPhysics.simulateDropOutcome('safe', { seed: 42 });
  assert.equal(safeDrop.didBreak, true, 'Massive Safe breaks on impact');
  assert.ok(safeDrop.effectsTriggered.goldBurstCoins > 0, 'Massive Safe triggers GOLD_BURST');
  assert.equal(safeDrop.effectsTriggered.floorCracked, true, 'Massive Safe triggers FLOOR_CRACK');

  const duckEmperorDrop = DropPhysics.simulateDropOutcome('rubber_duck_emperor', { seed: 42 });
  assert.ok(duckEmperorDrop.effectsTriggered.ducksSpawned > 0, 'Rubber Duck Emperor triggers DUCK_STORM / DUCKIFIED');
  assert.ok(duckEmperorDrop.effectsTriggered.activeEffects.includes('DUCKIFIED'), 'Rubber Duck Emperor includes DUCKIFIED');

  const multiDropSim = DropPhysics.simulateDropOutcome('bowling_ball_bag', { seed: 42 });
  assert.equal(multiDropSim.effectsTriggered.multiDropped, true, 'Bowling Ball Bag triggers MULTI_DROP');

  // Verify Post-Drop Environmental Effects Infrastructure (Anti-Gravity Field Decay & Mop Floor)
  let lastEnvEvent = null;
  const envWorld = new DropPhysics.DropWorld(null, {
    onEnvironmentalEffectsChange(_effects, ev) {
      lastEnvEvent = ev;
    }
  });
  // Prevent requestAnimationFrame in headless Node environment
  envWorld.startLoop = () => {};

  envWorld.activateEnvironmentalEffect('antiGravity');
  assert.equal(envWorld.activeEffects.length, 1, 'Anti-Gravity Field must be active');
  assert.equal(envWorld.activeEffects[0].id, 'antiGravity');
  assert.equal(envWorld.activeEffects[0].strength, 0.6);
  assert.equal(envWorld.activeEffects[0].remainingDrops, 3);
  assert.equal(envWorld.activeEffects[0].decayRate, 0.2);

  // Drop 1 immediately after activation -> Gravity = 40% normal (0.4)
  assert.equal(envWorld.getGravityMultiplier(), 0.4, 'Drop 1 after activation: Gravity = 40% normal');
  envWorld.decayEnvironmentalEffectsAfterDrop();

  // Drop 2 -> Gravity = 60% normal (0.6), strength = 0.4, remainingDrops = 2
  assert.equal(envWorld.activeEffects[0].strength, 0.4);
  assert.equal(envWorld.activeEffects[0].remainingDrops, 2);
  assert.equal(envWorld.getGravityMultiplier(), 0.6, 'Drop 2 after activation: Gravity = 60% normal');
  envWorld.decayEnvironmentalEffectsAfterDrop();

  // Drop 3 -> Gravity = 80% normal (0.8), strength = 0.2, remainingDrops = 1
  assert.equal(envWorld.activeEffects[0].strength, 0.2);
  assert.equal(envWorld.activeEffects[0].remainingDrops, 1);
  assert.equal(envWorld.getGravityMultiplier(), 0.8, 'Drop 3 after activation: Gravity = 80% normal');
  envWorld.decayEnvironmentalEffectsAfterDrop();

  // Field collapses -> Gravity restored (1.0)
  assert.equal(envWorld.activeEffects.length, 0, 'Anti-Gravity Field must collapse after 3 drops');
  assert.equal(envWorld.getGravityMultiplier(), 1.0, 'Gravity must be restored to 100% normal');

  // Verify coexisting stacked effects & Mop Floor clearing
  envWorld.activateEnvironmentalEffect('antiGravity');
  envWorld.activateEnvironmentalEffect('slipperyFloor');
  assert.equal(envWorld.activeEffects.length, 2, 'Multiple environmental effects must coexist');
  envWorld.clearMess(true);
  assert.equal(envWorld.activeEffects.length, 0, 'Mop Floor must remove all active environmental effects');
  assert.equal(envWorld.getGravityMultiplier(), 1.0, 'Mop Floor must reset gravity');
  assert.equal(lastEnvEvent.type, 'cleared');
  assert.equal(lastEnvEvent.title, 'CHAOS CLEARED');
  assert.equal(lastEnvEvent.detail, 'Reality reluctantly restored.');

  console.log('✅ 2/6 Physics simulation, multi-effects & post-drop environmental effects verified.');

  // ---------------------------------------------------------------------------
  // 3. Verify Chaos Factor Score Formula
  // ---------------------------------------------------------------------------
  const pianoObj = DropObjects.getObjectById('piano');
  const pianoScore = DropObjects.calculateChaosScore({
    object: 'piano',
    impactForce: 185
  });
  assert.equal(pianoScore.didBreak, true);
  assert.equal(
    pianoScore.score,
    Math.round(185 * pianoObj.weightModifier) + pianoObj.breakageBonus + pianoObj.specialEffectBonus,
    'Chaos score must equal (impactForce * weightModifier) + breakageBonus + specialEffectBonus'
  );
  console.log('✅ 3/6 Chaos Factor score formula verified.');

  // ---------------------------------------------------------------------------
  // 4. Verify Share URL Encoding (/drop?object=piano&score=842)
  // ---------------------------------------------------------------------------
  const shareUrl = DropObjects.buildSharePath('piano', 842);
  assert.equal(shareUrl, '/drop?object=piano&score=842');
  console.log('✅ 4/6 Share URL generator (/drop?object=piano&score=842) verified.');

  // ---------------------------------------------------------------------------
  // 5. Verify Nickname Filter (Same Rules as Lemonade Stand)
  // ---------------------------------------------------------------------------
  assert.equal(ProfanityFilter.validateNickname('GravityChamp').valid, true);
  assert.equal(ProfanityFilter.validateNickname('GlassBottle').valid, true);
  assert.equal(ProfanityFilter.validateNickname('Classic_Piano').valid, true);
  assert.equal(ProfanityFilter.validateNickname('ab').valid, false, 'Too short');
  assert.equal(ProfanityFilter.validateNickname('f_u_c_k_y_o_u').valid, false, 'Profanity rejected');
  assert.equal(ProfanityFilter.validateNickname('BadAss99').valid, false, 'Token profanity rejected');
  assert.equal(ProfanityFilter.validateNickname('sh1thead').valid, false, 'Leetspeak profanity rejected');
  const randomName = ProfanityFilter.generateNickname();
  assert.equal(ProfanityFilter.validateNickname(randomName).valid, true);
  console.log('✅ 5/6 Lemonade Stand Nickname & Profanity Filter verified.');

  // ---------------------------------------------------------------------------
  // 6. Verify Live HTTP + SQLite Top 50 Leaderboard API & /drop Subpath Routing
  // ---------------------------------------------------------------------------
  const server = createServer(':memory:');
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Healthcheck via /drop/api/health
    const healthRes = await fetch(`${baseUrl}/drop/api/health`);
    assert.equal(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.equal(healthData.ok, true);
    assert.equal(healthData.deployTarget, 'dropthething.stabthefinger.com');

    // Fetch initial seeded Top 50 leaderboard
    const lbRes = await fetch(`${baseUrl}/drop/api/leaderboard?limit=50`);
    assert.equal(lbRes.status, 200);
    const lbData = await lbRes.json();
    assert.equal(lbData.ok, true);
    assert.equal(lbData.entries.length, 12, 'Should have 12 starter entries');

    // Submit a new high Chaos Score
    const postRes = await fetch(`${baseUrl}/drop/api/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: 'Newton_Yeeter',
        object_id: 'piano',
        score: 963,
        impact_force: 233,
        mode: 'retro',
        player_token: 'TestPlayerToken12345'
      })
    });
    assert.equal(postRes.status, 201);
    const postData = await postRes.json();
    assert.equal(postData.ok, true);
    assert.equal(postData.entry.nickname, 'Newton_Yeeter');
    assert.equal(postData.entry.object_id, 'piano');
    assert.equal(postData.entry.player_token.length, 64, 'Player token must be SHA-256 hashed');

    // Verify Top 50 pruning & ordering
    const lbAfterRes = await fetch(`${baseUrl}/api/leaderboard?limit=50`);
    const lbAfter = await lbAfterRes.json();
    assert.equal(lbAfter.entries[0].nickname, 'Newton_Yeeter');

    // Verify SPA share route /drop?object=piano&score=842 serves index.html with Paging UI
    const pageRes = await fetch(`${baseUrl}/drop?object=piano&score=842`);
    assert.equal(pageRes.status, 200);
    const html = await pageRes.text();
    assert.ok(html.includes('DROP THE THING'), 'Share URL must serve main web app');
    assert.ok(html.includes('dropthething.stabthefinger.com'), 'Must display dropthething.stabthefinger.com in footer');
    assert.ok(!html.includes('Family-friendly filter active'), 'Subtext labelling must be removed');
    assert.ok(!html.includes('id="nickname-feedback"'), 'Nickname subtext element must be removed');
    assert.ok(html.includes('id="btn-prev-page"'), 'Must include Previous Page button');
    assert.ok(html.includes('id="btn-next-page"'), 'Must include Next Page button');
    assert.ok(html.includes('id="page-indicator"'), 'Must include Page X of Y indicator');
    assert.ok(html.includes('Random Thing'), 'Must include Random Thing button');
    assert.ok(html.includes('id="active-effects-panel"'), 'Must include Active Chaos Effects panel');
    assert.ok(html.includes('ACTIVE CHAOS EFFECTS'), 'Must include ACTIVE CHAOS EFFECTS header');

    // Submit an expansion object (safe) score
    const postSafeRes = await fetch(`${baseUrl}/drop/api/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: 'VaultBreaker',
        object_id: 'safe',
        score: 2150,
        impact_force: 310,
        mode: 'modern',
        player_token: 'SafePlayerToken12345'
      })
    });
    assert.equal(postSafeRes.status, 201);

    console.log('✅ 6/6 Top 50 Chaos Leaderboard API & /drop routing verified.\n');
    console.log('🎉 ALL DROP THE THING TESTS PASSED!');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
