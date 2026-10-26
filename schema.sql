-- ============================================================================
-- Drop The Thing — Canonical SQLite Schema (Top 50 Chaos Leaderboard)
-- Deployed at: dropthething.stabthefinger.com
-- ============================================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leaderboard_chaos (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  object_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  impact_force INTEGER NOT NULL DEFAULT 0,
  did_break INTEGER NOT NULL DEFAULT 1,
  special_effect TEXT NOT NULL DEFAULT 'shatter',
  mode TEXT NOT NULL DEFAULT 'modern' CHECK (mode IN ('modern', 'retro')),
  date TEXT NOT NULL,
  player_token TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_chaos_score_date ON leaderboard_chaos (score DESC, date DESC);
CREATE INDEX IF NOT EXISTS idx_chaos_object ON leaderboard_chaos (object_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_chaos_date ON leaderboard_chaos (date DESC);
