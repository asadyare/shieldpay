import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api.js";
import { formatMoney, formatDate } from "../lib/format.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { Card } from "../components/Card.jsx";
import { Badge } from "../components/Badge.jsx";
import styles from "./Customers.module.css";

export function Customers() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJson("/api/customers")
      .then((d) => {
        if (!cancelled) setRows(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <>
        <PageHeader title="Customers" subtitle="Organizations and individuals you collect or release funds for." />
        <Card>
          <p className={styles.error}>Failed to load customers.</p>
        </Card>
      </>
    );
  }

  if (!rows) {
    return (
      <PageHeader title="Customers" subtitle="Loading…" />
    );
  }

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Manage counterparties, balances, and onboarding status."
      />
      <Card className={styles.card}>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No customers. Seed the database with{" "}
                    <code>npm run db:seed</code>.
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/customers/${c.id}`} className={styles.link}>
                        {c.name}
                      </Link>
                    </td>
                    <td>{c.email}</td>
                    <td className={styles.muted}>{c.company || "—"}</td>
                    <td>
                      <Badge variant={c.status}>{c.status}</Badge>
                    </td>
                    <td>{formatMoney(c.balance_cents)}</td>
                    <td className={styles.muted}>{formatDate(c.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
