'use strict';

const { getDb } = require('../src/db');

const db = getDb();
const count = db.prepare('SELECT COUNT(*) AS cnt FROM leaderboard_chaos').get();
console.log(`✅ Drop The Thing database initialized (${count.cnt} leaderboard entries).`);
