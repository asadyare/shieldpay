import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api.js";
import { formatMoney, formatDate } from "../lib/format.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { Card } from "../components/Card.jsx";
import { Badge } from "../components/Badge.jsx";
import styles from "./Transactions.module.css";

const filters = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

export function Transactions() {
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    fetchJson(`/api/transactions${q}`)
      .then((d) => {
        if (!cancelled) setRows(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Escrow holds, releases, refunds, and platform fees across all customers."
        action={
          <div className={styles.filters}>
            {filters.map((f) => (
              <button
                key={f.value || "all"}
                type="button"
                className={
                  status === f.value ? styles.filterActive : styles.filter
                }
                onClick={() => setStatus(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      {error ? (
        <Card>
          <p className={styles.error}>Failed to load transactions.</p>
        </Card>
      ) : !rows ? (
        <Card>Loading…</Card>
      ) : (
        <Card className={styles.card}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      No transactions match this filter.
                    </td>
                  </tr>
                ) : (
                  rows.map((t) => (
                    <tr key={t.id}>
                      <td className={styles.mono}>{t.reference}</td>
                      <td>
                        <Link
                          to={`/customers/${t.customer_id}`}
                          className={styles.link}
                        >
                          {t.customer_name}
                        </Link>
                        <div className={styles.email}>{t.customer_email}</div>
                      </td>
                      <td>
                        <Badge variant={t.type}>
                          {t.type.replace("_", " ")}
                        </Badge>
                      </td>
                      <td>{formatMoney(t.amount_cents, t.currency)}</td>
                      <td>
                        <Badge variant={t.status}>{t.status}</Badge>
                      </td>
                      <td className={styles.muted}>
                        {formatDate(t.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
