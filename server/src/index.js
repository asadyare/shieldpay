import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

getDb();

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "shieldpay-api" });
});

app.get("/api/dashboard", (_req, res) => {
  const db = getDb();
  const customers = db.prepare("SELECT COUNT(*) AS n FROM customers").get();
  const tx = db.prepare("SELECT COUNT(*) AS n FROM transactions").get();
  const volume = db
    .prepare(
      "SELECT COALESCE(SUM(amount_cents), 0) AS v FROM transactions WHERE status = 'completed'"
    )
    .get();
  const pendingEscrow = db
    .prepare(
      `SELECT COALESCE(SUM(amount_cents), 0) AS v FROM transactions
       WHERE type = 'escrow_hold' AND status = 'pending'`
    )
    .get();
  const recent = db
    .prepare(
      `SELECT t.*, c.name AS customer_name, c.email AS customer_email
       FROM transactions t
       JOIN customers c ON c.id = t.customer_id
       ORDER BY t.created_at DESC LIMIT 8`
    )
    .all();

  res.json({
    stats: {
      customerCount: customers.n,
      transactionCount: tx.n,
      completedVolumeCents: volume.v,
      pendingEscrowCents: pendingEscrow.v,
    },
    recentTransactions: recent,
  });
});

app.get("/api/customers", (_req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT id, name, email, company, status, balance_cents, created_at
       FROM customers ORDER BY created_at DESC`
    )
    .all();
  res.json(rows);
});

app.get("/api/customers/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const customer = getDb()
    .prepare(
      `SELECT id, name, email, company, status, balance_cents, created_at
       FROM customers WHERE id = ?`
    )
    .get(id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  const transactions = getDb()
    .prepare(
      `SELECT * FROM transactions WHERE customer_id = ? ORDER BY created_at DESC`
    )
    .all(id);
  res.json({ ...customer, transactions });
});

app.get("/api/transactions", (req, res) => {
  const status = req.query.status;
  let sql = `SELECT t.*, c.name AS customer_name, c.email AS customer_email
             FROM transactions t
             JOIN customers c ON c.id = t.customer_id`;
  const params = [];
  if (status && ["pending", "completed", "failed"].includes(String(status))) {
    sql += " WHERE t.status = ?";
    params.push(status);
  }
  sql += " ORDER BY t.created_at DESC";
  const rows = getDb().prepare(sql).all(...params);
  res.json(rows);
});

app.get("/api/admin/summary", (_req, res) => {
  const db = getDb();
  const byStatus = db
    .prepare(
      `SELECT status, COUNT(*) AS n FROM transactions GROUP BY status`
    )
    .all();
  const byType = db
    .prepare(`SELECT type, COUNT(*) AS n FROM transactions GROUP BY type`)
    .all();
  res.json({
    environment: process.env.NODE_ENV || "development",
    database: "SQLite (shieldpay.db)",
    transactionBreakdown: { byStatus: byStatus, byType: byType },
  });
});

app.get("/api/export/customers.csv", (_req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT id, name, email, company, status, balance_cents, created_at FROM customers`
    )
    .all();
  const header = "id,name,email,company,status,balance_cents,created_at\n";
  const lines = rows.map((r) =>
    [
      r.id,
      csvEscape(r.name),
      csvEscape(r.email),
      csvEscape(r.company || ""),
      r.status,
      r.balance_cents,
      r.created_at,
    ].join(",")
  );
  const body = header + lines.join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="shieldpay-customers.csv"'
  );
  res.send(body);
});

app.get("/api/export/transactions.csv", (_req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT t.id, t.customer_id, c.email AS customer_email, t.reference, t.type,
              t.amount_cents, t.currency, t.status, t.description, t.created_at
       FROM transactions t
       JOIN customers c ON c.id = t.customer_id
       ORDER BY t.id`
    )
    .all();
  const header =
    "id,customer_id,customer_email,reference,type,amount_cents,currency,status,description,created_at\n";
  const lines = rows.map((r) =>
    [
      r.id,
      r.customer_id,
      csvEscape(r.customer_email),
      csvEscape(r.reference),
      r.type,
      r.amount_cents,
      r.currency,
      r.status,
      csvEscape(r.description || ""),
      r.created_at,
    ].join(",")
  );
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="shieldpay-transactions.csv"'
  );
  res.send(header + lines.join("\n"));
});

function csvEscape(s) {
  const str = String(s);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next(err);
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Shieldpay API http://localhost:${PORT}`);
});
