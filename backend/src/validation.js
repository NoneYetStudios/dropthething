/**
 * Drop The Thing - Score Submission & Nickname Validation
 * Validates:
 * 1. Family-friendly nickname (same rules as Lemonade Stand via ProfanityFilter)
 * 2. Valid object_id from the 12 droppable objects
 * 3. Plausible impact_force & Chaos Factor score math
 */
'use strict';

const { validateNickname } = require('./profanityFilter');
const { getObjectById, calculateChaosScore } = require('../../frontend/js/objects');
const { isValidRawPlayerToken, hashPlayerToken } = require('./db');

const MAX_CHAOS_SCORE = 25000;
const MIN_CHAOS_SCORE = 10;

function validateScoreSubmission(body) {
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      status: 400,
      code: 'INVALID_PAYLOAD',
      error: 'Invalid request payload.'
    };
  }

  // 1. Validate nickname (accepts `nickname` or `stand_name` alias)
  const rawName = typeof body.nickname === 'string'
    ? body.nickname
    : (typeof body.stand_name === 'string' ? body.stand_name : '');

  const nameCheck = validateNickname(rawName);
  if (!nameCheck.valid) {
    return {
      valid: false,
      status: 400,
      code: nameCheck.code,
      error: nameCheck.reason
    };
  }

  // 2. Validate object_id (accepts `object_id` or `object`)
  const rawObjId = typeof body.object_id === 'string'
    ? body.object_id
    : (typeof body.object === 'string' ? body.object : '');

  const obj = getObjectById(rawObjId);
  if (!obj) {
    return {
      valid: false,
      status: 400,
      code: 'INVALID_OBJECT',
      error: 'Unknown object_id. Must be a valid Drop The Thing catalog object.'
    };
  }

  // 3. Validate mode
  const rawMode = typeof body.mode === 'string' ? body.mode.trim().toLowerCase() : 'modern';
  const mode = rawMode === 'retro' ? 'retro' : 'modern';

  // 4. Validate score & impact_force
  const submittedScore = Number(body.score);
  if (!Number.isInteger(submittedScore) || submittedScore < MIN_CHAOS_SCORE || submittedScore > MAX_CHAOS_SCORE) {
    return {
      valid: false,
      status: 400,
      code: 'SCORE_OUT_OF_BOUNDS',
      error: `Chaos score must be an integer between ${MIN_CHAOS_SCORE} and ${MAX_CHAOS_SCORE}.`
    };
  }

  let impactForce = body.impact_force !== undefined ? Number(body.impact_force) : null;
  if (impactForce !== null && (!Number.isFinite(impactForce) || impactForce < 1 || impactForce > 2500)) {
    return {
      valid: false,
      status: 400,
      code: 'INVALID_IMPACT_FORCE',
      error: 'Impact force out of plausible physics bounds.'
    };
  }

  // If impact_force was provided, verify Chaos Factor math consistency
  let finalScore = submittedScore;
  let didBreak = obj.fragility < (impactForce || 100);
  if (impactForce !== null) {
    const computed = calculateChaosScore({
      object: obj,
      impactForce
    });
    didBreak = computed.didBreak;
    if (submittedScore >= computed.score && submittedScore <= computed.score + 8000) {
      finalScore = submittedScore;
    } else {
      finalScore = computed.score;
    }
  } else {
    impactForce = Math.max(10, Math.round((submittedScore - obj.specialEffectBonus) / obj.weightModifier));
    didBreak = obj.fragility < impactForce;
  }

  // 5. Optional player token
  const rawToken = typeof body.player_token === 'string' ? body.player_token.trim() : '';
  if (rawToken && !isValidRawPlayerToken(rawToken)) {
    return {
      valid: false,
      status: 400,
      code: 'INVALID_PLAYER_TOKEN',
      error: 'Player token must be 16–24 alphanumeric characters.'
    };
  }

  const playerTokenHash = rawToken ? hashPlayerToken(rawToken) : '';

  return {
    valid: true,
    data: {
      nickname: nameCheck.sanitized,
      object_id: obj.id,
      score: finalScore,
      impact_force: Math.round(impactForce),
      did_break: didBreak,
      special_effect: obj.specialEffect,
      mode,
      player_token_hash: playerTokenHash
    }
  };
}

module.exports = {
  MAX_CHAOS_SCORE,
  MIN_CHAOS_SCORE,
  validateScoreSubmission
};
