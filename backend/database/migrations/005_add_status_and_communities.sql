-- backend/database/migrations/005_add_status_and_communities.sql

-- Add status columns if missing
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS approved_at TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rejected_at TEXT;

ALTER TABLE notices ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE notices ADD COLUMN IF NOT EXISTS approved_at TEXT;
ALTER TABLE notices ADD COLUMN IF NOT EXISTS rejected_at TEXT;

ALTER TABLE skills ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE skills ADD COLUMN IF NOT EXISTS approved_at TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS rejected_at TEXT;

-- Community column (string slug) if missing
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS community TEXT;
ALTER TABLE notices ADD COLUMN IF NOT EXISTS community TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS community TEXT;

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);
CREATE INDEX IF NOT EXISTS idx_jobs_community ON jobs(community);
CREATE INDEX IF NOT EXISTS idx_notices_community ON notices(community);
CREATE INDEX IF NOT EXISTS idx_skills_community ON skills(community);
