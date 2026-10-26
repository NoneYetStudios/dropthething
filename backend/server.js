/**
 * Drop The Thing - Zero-Dependency Node.js HTTP + SQLite API & Static Server
 * Serves dropthething.stabthefinger.com (and /drop path for backwards compatibility).
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {
  getDb,
  insertChaosScore,
  fetchLeaderboard,
  pruneLeaderboard
} = require('./src/db');
const { validateNickname } = require('./src/profanityFilter');
const { validateScoreSubmission } = require('./src/validation');
const { getObjectById } = require('../frontend/js/objects');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function resolveClientIp(req) {
  const headers = req.headers || {};
  const edgeIp =
    headers['x-nf-client-connection-ip'] ||
    headers['x-vercel-forwarded-for'] ||
    headers['cf-connecting-ip'] ||
    headers['x-forwarded-for'] ||
    headers['fly-client-ip'];
  if (typeof edgeIp === 'string' && edgeIp.trim()) {
    return edgeIp.split(',')[0].trim();
  }
  return (req.socket && req.socket.remoteAddress) || '127.0.0.1';
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function parseJsonBody(req, maxBytes = 32768) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > maxBytes) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

function createServer(customDbPath) {
  const db = getDb(customDbPath);
  const frontendDir = path.resolve(__dirname, '../frontend');

  // Lightweight in-memory rate limiter for score submissions
  const rateBuckets = new Map();
  const maxSubmissionsPerMinute = Number(process.env.SUBMIT_RATE_LIMIT_MAX || 30);

  function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const entry = rateBuckets.get(ip) || { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }
    entry.count += 1;
    rateBuckets.set(ip, entry);
    return entry.count <= maxSubmissionsPerMinute;
  }

  // Periodic Top 50 pruning
  const pruneTimer = setInterval(() => {
    try {
      pruneLeaderboard(db, 50);
    } catch (_) {}
  }, 60 * 60 * 1000);
  if (typeof pruneTimer.unref === 'function') {
    pruneTimer.unref();
  }

  const server = http.createServer(async (req, res) => {
    const method = req.method || 'GET';
    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      });
      return res.end();
    }

    const parsedUrl = new URL(req.url || '/', 'http://localhost');
    let pathname = parsedUrl.pathname;

    // Strip optional /drop prefix so /drop/api/... and /drop/... map identically to /api/... and /...
    if (pathname === '/drop' || pathname === '/drop/') {
      pathname = '/';
    } else if (pathname.startsWith('/drop/')) {
      pathname = pathname.slice(5);
    }

    // ========================================================================
    // API ENDPOINTS
    // ========================================================================
    if (pathname.startsWith('/api')) {
      const apiRoute = pathname.replace(/^\/api\/?/, '').replace(/\/+$/, '');

      // 1. Healthcheck
      if ((apiRoute === 'health' || apiRoute === '') && method === 'GET') {
        return sendJson(res, 200, {
          ok: true,
          service: 'drop-the-thing-api',
          deployTarget: 'dropthething.stabthefinger.com',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        });
      }

      // 2. Validate Nickname (Same rules as Lemonade Stand)
      if (apiRoute === 'validate-nickname' && method === 'POST') {
        try {
          const body = await parseJsonBody(req);
          const candidate = body.nickname || body.stand_name || '';
          const check = validateNickname(candidate);
          if (!check.valid) {
            return sendJson(res, 400, {
              ok: false,
              valid: false,
              code: check.code,
              error: check.reason
            });
          }
          return sendJson(res, 200, {
            ok: true,
            valid: true,
            nickname: check.sanitized,
            normalized: check.normalized,
            message: ''
          });
        } catch (err) {
          return sendJson(res, 400, {
            ok: false,
            code: 'BAD_JSON',
            error: 'Invalid JSON request body.'
          });
        }
      }

      // 3. GET Top 50 Chaos Leaderboard
      if ((apiRoute === 'leaderboard' || apiRoute === 'scores') && method === 'GET') {
        const limit = parsedUrl.searchParams.get('limit') || '50';
        const mode = parsedUrl.searchParams.get('mode') || null;
        const objParam = parsedUrl.searchParams.get('object') || parsedUrl.searchParams.get('object_id') || null;
        let objectId = null;
        if (objParam) {
          const obj = getObjectById(objParam);
          if (!obj) {
            return sendJson(res, 400, {
              ok: false,
              code: 'INVALID_OBJECT',
              error: `Unknown object filter: ${objParam}`
            });
          }
          objectId = obj.id;
        }

        const entries = fetchLeaderboard(db, {
          limit: Math.min(50, Math.max(1, parseInt(limit, 10) || 50)),
          mode,
          object_id: objectId
        });

        return sendJson(res, 200, {
          ok: true,
          title: 'Top 50 Chaos Leaderboard',
          count: entries.length,
          entries
        });
      }

      // 4. POST New Chaos Score to Top 50 Leaderboard
      if (
        (apiRoute === 'leaderboard' || apiRoute === 'leaderboard/submit' || apiRoute === 'scores') &&
        method === 'POST'
      ) {
        const ip = resolveClientIp(req);
        if (!checkRateLimit(ip)) {
          return sendJson(res, 429, {
            ok: false,
            code: 'RATE_LIMITED',
            error: 'Too many score submissions! Let gravity cool down for a minute.'
          });
        }

        try {
          const body = await parseJsonBody(req);
          const validation = validateScoreSubmission(body);
          if (!validation.valid) {
            return sendJson(res, validation.status || 400, {
              ok: false,
              code: validation.code,
              error: validation.error
            });
          }

          const entry = insertChaosScore(db, validation.data);
          return sendJson(res, 201, {
            ok: true,
            message: 'Chaos score recorded in the Top 50 Leaderboard!',
            entry
          });
        } catch (err) {
          return sendJson(res, 400, {
            ok: false,
            code: 'BAD_REQUEST',
            error: 'Invalid JSON payload.'
          });
        }
      }

      return sendJson(res, 404, {
        ok: false,
        code: 'NOT_FOUND',
        error: 'API endpoint not found.'
      });
    }

    // ========================================================================
    // STATIC FRONTEND SERVER (SPA Fallback for / and /drop?object=...&score=...)
    // ========================================================================
    let relPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const safePath = path.normalize(path.join(frontendDir, relPath));

    // Prevent directory traversal
    if (!safePath.startsWith(frontendDir)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      return fs.createReadStream(safePath).pipe(res);
    }

    // Fallback to index.html for SPA routes (e.g. /drop?object=piano&score=842)
    const indexHtmlPath = path.join(frontendDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(indexHtmlPath).pipe(res);
  });

  return server;
}

if (require.main === module) {
  const PORT = Number(process.env.PORT || 3000);
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`☄️ Drop The Thing running at http://localhost:${PORT} (target: dropthething.stabthefinger.com)`);
  });
}

module.exports = { createServer, resolveClientIp };
