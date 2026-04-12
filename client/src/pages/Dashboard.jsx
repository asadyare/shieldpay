import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api.js";
import { formatMoney, formatDate } from "../lib/format.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { Card } from "../components/Card.jsx";
import { Badge } from "../components/Badge.jsx";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJson("/api/dashboard")
      .then((d) => {
        if (!cancelled) setData(d);
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
        <PageHeader
          title="Dashboard"
          subtitle="Overview of escrow volume, customers, and recent activity."
        />
        <Card>
          <p className={styles.error}>
            Could not load dashboard. Is the API running on port 3001?
          </p>
          <code className={styles.errDetail}>{error}</code>
        </Card>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Loading…" />
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </>
    );
  }

  const { stats, recentTransactions } = data;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Shieldpay-style escrow: hold funds, release to beneficiaries, and track fees in one place."
      />

      <div className={styles.stats}>
        <Card>
          <div className={styles.statLabel}>Customers</div>
          <div className={styles.statValue}>{stats.customerCount}</div>
        </Card>
        <Card>
          <div className={styles.statLabel}>Transactions</div>
          <div className={styles.statValue}>{stats.transactionCount}</div>
        </Card>
        <Card>
          <div className={styles.statLabel}>Completed volume</div>
          <div className={styles.statValue}>
            {formatMoney(stats.completedVolumeCents)}
          </div>
        </Card>
        <Card>
          <div className={styles.statLabel}>Pending escrow</div>
          <div className={styles.statValue}>
            {formatMoney(stats.pendingEscrowCents)}
          </div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        <h2 className={styles.sectionTitle}>Recent transactions</h2>
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
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No transactions yet. Run{" "}
                    <code>npm run db:seed</code> from the project root.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/transactions`} className={styles.ref}>
                        {t.reference}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/customers/${t.customer_id}`}
                        className={styles.ref}
                      >
                        {t.customer_name}
                      </Link>
                    </td>
                    <td>
                      <Badge variant={t.type}>{t.type.replace("_", " ")}</Badge>
                    </td>
                    <td>{formatMoney(t.amount_cents, t.currency)}</td>
                    <td>
                      <Badge variant={t.status}>{t.status}</Badge>
                    </td>
                    <td className={styles.mutedCell}>
                      {formatDate(t.created_at)}
                    </td>
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
