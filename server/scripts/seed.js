import { getDb } from "../src/db.js";

const db = getDb();

const customers = [
  {
    name: "Avery Chen",
    email: "avery@example.com",
    company: "Northwind Traders",
    status: "active",
    balance_cents: 125000,
  },
  {
    name: "Jordan Mills",
    email: "jordan@example.com",
    company: "Contoso Ltd",
    status: "active",
    balance_cents: 48200,
  },
  {
    name: "Sam Rivera",
    email: "sam@example.com",
    company: "Fabrikam Inc",
    status: "pending",
    balance_cents: 0,
  },
];

const insertCustomer = db.prepare(
  `INSERT INTO customers (name, email, company, status, balance_cents)
   VALUES (?, ?, ?, ?, ?)`
);

const existing = db.prepare("SELECT COUNT(*) AS n FROM customers").get();
if (existing.n > 0) {
  console.log("Database already has customers; skip seed.");
  process.exit(0);
}

const insertTx = db.prepare(
  `INSERT INTO transactions (customer_id, reference, type, amount_cents, currency, status, description)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

db.exec("BEGIN");
try {
  for (const c of customers) {
    const info = insertCustomer.run(
      c.name,
      c.email,
      c.company,
      c.status,
      c.balance_cents
    );
    const id = Number(info.lastInsertRowid);
    insertTx.run(
      id,
      `REF-${id}-001`,
      "escrow_hold",
      50000,
      "USD",
      "completed",
      "Initial escrow for milestone 1"
    );
    insertTx.run(
      id,
      `REF-${id}-002`,
      "release",
      25000,
      "USD",
      "completed",
      "Released to beneficiary"
    );
    insertTx.run(
      id,
      `REF-${id}-003`,
      "fee",
      500,
      "USD",
      "completed",
      "Platform fee"
    );
  }
  insertTx.run(
    1,
    "REF-PEND-1",
    "escrow_hold",
    100000,
    "USD",
    "pending",
    "Large deal in review"
  );
  db.exec("COMMIT");
} catch (e) {
  db.exec("ROLLBACK");
  throw e;
}

console.log("Seed complete.");
