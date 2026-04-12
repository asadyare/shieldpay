import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.SQLITE_PATH || path.join(dataDir, "shieldpay.db");
const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    company TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    balance_cents INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reference TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('escrow_hold', 'release', 'refund', 'fee')),
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
`);

export function getDb() {
  return db;
}
