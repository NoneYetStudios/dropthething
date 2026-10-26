/**
 * Drop The Thing - SQLite Database Layer (Top 50 Chaos Leaderboard)
 * Uses Node.js built-in node:sqlite (zero external dependencies) with parameterized queries.
 */
'use strict';

// Suppress node:sqlite ExperimentalWarning for clean console output
const originalEmitWarning = process.emitWarning;
process.emitWarning = function (warning, ...args) {
  const type = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].type);
  const name = warning && typeof warning === 'object' ? warning.name : '';
  const msg = typeof warning === 'string' ? warning : (warning && warning.message) || '';
  if ((type === 'ExperimentalWarning' || name === 'ExperimentalWarning') && /sqlite/i.test(msg)) {
    return;
  }
  return originalEmitWarning.call(this, warning, ...args);
};

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { PLAYER_TOKEN_REGEX } = require('./profanityFilter');

const DEFAULT_DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../data/dropthething.db');
const SCHEMA_PATH = path.resolve(__dirname, '../../schema.sql');

let dbInstance = null;

function isValidRawPlayerToken(rawToken) {
  return typeof rawToken === 'string' && PLAYER_TOKEN_REGEX.test(rawToken.trim());
}

function hashPlayerToken(rawToken) {
  if (!isValidRawPlayerToken(rawToken)) return '';
  return crypto.createHash('sha256').update(rawToken.trim(), 'utf8').digest('hex');
}

function loadCanonicalSchema() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    throw new Error(`Canonical schema file not found at ${SCHEMA_PATH}`);
  }
  return fs.readFileSync(SCHEMA_PATH, 'utf8');
}

function getDb(customPath) {
  if (dbInstance && !customPath) {
    return dbInstance;
  }

  const targetPath = customPath || DEFAULT_DB_PATH;
  if (targetPath !== ':memory:') {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new DatabaseSync(targetPath);
  const schemaSql = loadCanonicalSchema();
  db.exec(schemaSql);

  if (!customPath) {
    dbInstance = db;
  }

  const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM leaderboard_chaos').get();
  if (countRow && countRow.cnt === 0 && process.env.SKIP_SEED !== 'true') {
    seedInitialData(db);
  }

  pruneLeaderboard(db, 50);
  return db;
}

/**
 * Seed 12 humorous, family-friendly starter chaos scores (covering all 12 objects).
 */
function seedInitialData(db) {
  const now = new Date().toISOString();
  const starters = [
    { nickname: 'GravityChamp', object_id: 'piano', score: 842, impact_force: 185, did_break: 1, special_effect: 'shatter', mode: 'modern' },
    { nickname: 'SirIsaacNewton', object_id: 'anvil', score: 798, impact_force: 176, did_break: 1, special_effect: 'explode', mode: 'retro' },
    { nickname: 'ChaosWizard', object_id: 'mystery_box', score: 735, impact_force: 151, did_break: 1, special_effect: 'explode', mode: 'modern' },
    { nickname: 'SplatMaster', object_id: 'giant_egg', score: 599, impact_force: 148, did_break: 1, special_effect: 'splatter', mode: 'modern' },
    { nickname: 'TubeSmasher', object_id: 'tv', score: 662, impact_force: 155, did_break: 1, special_effect: 'explode', mode: 'retro' },
    { nickname: 'ToastLauncher', object_id: 'toaster', score: 494, impact_force: 116, did_break: 1, special_effect: 'explode', mode: 'modern' },
    { nickname: 'GourdCrusher', object_id: 'pumpkin', score: 464, impact_force: 130, did_break: 1, special_effect: 'splatter', mode: 'modern' },
    { nickname: 'GallagherFan', object_id: 'watermelon', score: 463, impact_force: 134, did_break: 1, special_effect: 'splatter', mode: 'retro' },
    { nickname: 'PinKing_99', object_id: 'bowling_ball', score: 363, impact_force: 130, did_break: 0, special_effect: 'bounce', mode: 'modern' },
    { nickname: 'BrickLayer', object_id: 'brick', score: 447, impact_force: 114, did_break: 1, special_effect: 'shatter', mode: 'retro' },
    { nickname: 'GlassCannon', object_id: 'glass_bottle', score: 384, impact_force: 91, did_break: 1, special_effect: 'shatter', mode: 'modern' },
    { nickname: 'DuckBouncer', object_id: 'rubber_duck', score: 292, impact_force: 88, did_break: 0, special_effect: 'bounce', mode: 'modern' }
  ];

  const stmt = db.prepare(`
    INSERT INTO leaderboard_chaos (
      id, nickname, object_id, score, impact_force, did_break, special_effect, mode, date, player_token
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of starters) {
    const id = crypto.randomUUID();
    const tokenHash = crypto.createHash('sha256').update(`Seed_${s.nickname}`).digest('hex');
    stmt.run(
      id,
      s.nickname,
      s.object_id,
      s.score,
      s.impact_force,
      s.did_break,
      s.special_effect,
      s.mode,
      now,
      tokenHash
    );
  }
}

/**
 * Keep only the Top 50 Chaos Scores in the database.
 */
function pruneLeaderboard(db, maxEntries = 50) {
  const limit = Math.max(10, Number(maxEntries) || 50);
  db.prepare(`
    DELETE FROM leaderboard_chaos
    WHERE id NOT IN (
      SELECT id FROM leaderboard_chaos
      ORDER BY score DESC, date DESC
      LIMIT ?
    )
  `).run(limit);
}

/**
 * Insert a validated Chaos Score record and prune to Top 50.
 */
function insertChaosScore(db, data) {
  const id = crypto.randomUUID();
  const date = new Date().toISOString();

  db.prepare(`
    INSERT INTO leaderboard_chaos (
      id, nickname, object_id, score, impact_force, did_break, special_effect, mode, date, player_token
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.nickname,
    data.object_id,
    data.score,
    data.impact_force,
    data.did_break ? 1 : 0,
    data.special_effect,
    data.mode,
    date,
    data.player_token_hash || ''
  );

  pruneLeaderboard(db, 50);

  return {
    id,
    nickname: data.nickname,
    object_id: data.object_id,
    score: data.score,
    impact_force: data.impact_force,
    did_break: Boolean(data.did_break),
    special_effect: data.special_effect,
    mode: data.mode,
    date,
    player_token: data.player_token_hash || ''
  };
}

/**
 * Fetch Top 50 Chaos Scores (optionally filtered by object_id or mode).
 */
function fetchLeaderboard(db, options = {}) {
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 50));
  const where = [];
  const params = [];

  if (options.object_id) {
    where.push('object_id = ?');
    params.push(options.object_id);
  }
  if (options.mode && (options.mode === 'modern' || options.mode === 'retro')) {
    where.push('mode = ?');
    params.push(options.mode);
  }

  let sql = `
    SELECT id, nickname, object_id, score, impact_force, did_break, special_effect, mode, date, player_token
    FROM leaderboard_chaos
  `;
  if (where.length > 0) {
    sql += ' WHERE ' + where.join(' AND ');
  }
  sql += ' ORDER BY score DESC, date DESC LIMIT ?';
  params.push(limit);

  const rows = db.prepare(sql).all(...params);
  return rows.map((r, idx) => ({
    rank: idx + 1,
    id: r.id,
    nickname: r.nickname,
    object_id: r.object_id,
    score: Number(r.score),
    impact_force: Number(r.impact_force),
    did_break: Boolean(r.did_break),
    special_effect: r.special_effect,
    mode: r.mode,
    date: r.date,
    player_token: r.player_token || ''
  }));
}

module.exports = {
  getDb,
  seedInitialData,
  pruneLeaderboard,
  insertChaosScore,
  fetchLeaderboard,
  isValidRawPlayerToken,
  hashPlayerToken
};
