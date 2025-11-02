import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'ciap.db');

export async function getDB() {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      community TEXT,
      title TEXT NOT NULL,
      body TEXT,
      createdAt INTEGER DEFAULT (strftime('%s','now')*1000)
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      community TEXT,
      title TEXT NOT NULL,
      summary TEXT,
      company TEXT,
      location TEXT,
      type TEXT,
      applyUrl TEXT,
      postedAt INTEGER DEFAULT (strftime('%s','now')*1000)
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      community TEXT,
      title TEXT NOT NULL,
      provider TEXT,
      summary TEXT,
      url TEXT,
      startsAt INTEGER
    );

    CREATE TABLE IF NOT EXISTS directory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      community TEXT,
      name TEXT NOT NULL,
      category TEXT,
      phone TEXT,
      hours TEXT,
      address TEXT
    );
  `);
  return db;
}
