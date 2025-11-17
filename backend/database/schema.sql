-- CIAP Complete Database Schema
-- SQLite database for Community Internet Access Platform
-- Run: sqlite3 database/ciap.db < database/schema.sql

-- ============================================
-- COMMUNITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS communities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);

-- ============================================
-- USERS TABLE (Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  community TEXT NOT NULL DEFAULT 'Acornhoek',
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_community ON users(community);

-- ============================================
-- NOTICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  community TEXT NOT NULL DEFAULT 'Acornhoek',
  title TEXT NOT NULL,
  body TEXT,
  contact TEXT,
  status TEXT DEFAULT 'approved',
  featured INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_notices_community ON notices(community);
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_notices_featured ON notices(featured);
CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at DESC);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  community TEXT NOT NULL DEFAULT 'Acornhoek',
  title TEXT NOT NULL,
  summary TEXT,
  company TEXT,
  location TEXT,
  type TEXT,
  apply_url TEXT,
  status TEXT DEFAULT 'approved',
  featured INTEGER DEFAULT 0,
  posted_at INTEGER NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_jobs_community ON jobs(community);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
CREATE INDEX IF NOT EXISTS idx_jobs_posted ON jobs(posted_at DESC);

-- ============================================
-- SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  community TEXT NOT NULL DEFAULT 'Acornhoek',
  title TEXT NOT NULL,
  provider TEXT,
  summary TEXT,
  url TEXT,
  status TEXT DEFAULT 'approved',
  featured INTEGER DEFAULT 0,
  starts_at INTEGER,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_skills_community ON skills(community);
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills(featured);
CREATE INDEX IF NOT EXISTS idx_skills_starts ON skills(starts_at DESC);

-- ============================================
-- DIRECTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS directory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  community TEXT NOT NULL DEFAULT 'Acornhoek',
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  phone TEXT,
  website TEXT,
  hours TEXT,
  address TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_directory_community ON directory(community);
CREATE INDEX IF NOT EXISTS idx_directory_category ON directory(category);
CREATE INDEX IF NOT EXISTS idx_directory_name ON directory(name);