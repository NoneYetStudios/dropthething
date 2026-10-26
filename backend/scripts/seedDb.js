'use strict';

const { getDb, seedInitialData, pruneLeaderboard } = require('../src/db');

const db = getDb();
seedInitialData(db);
pruneLeaderboard(db, 50);
const count = db.prepare('SELECT COUNT(*) AS cnt FROM leaderboard_chaos').get();
console.log(`✅ Drop The Thing database seeded and pruned to Top 50 (${count.cnt} entries).`);
