import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../api.js";
import { formatMoney, formatDate } from "../lib/format.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { Card } from "../components/Card.jsx";
import { Badge } from "../components/Badge.jsx";
import styles from "./CustomerDetail.module.css";

export function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    fetchJson(`/api/customers/${id}`)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <>
        <PageHeader title="Customer" />
        <Card>
          <p className={styles.error}>
            Customer not found or failed to load.
          </p>
          <Link to="/customers">← Back to customers</Link>
        </Card>
      </>
    );
  }

  if (!data) {
    return <PageHeader title="Customer" subtitle="Loading…" />;
  }

  return (
    <>
      <PageHeader
        title={data.name}
        subtitle={data.company || data.email}
        action={
          <Link to="/customers" className={styles.back}>
            ← All customers
          </Link>
        }
      />

      <div className={styles.grid}>
        <Card>
          <h2 className={styles.h2}>Profile</h2>
          <dl className={styles.dl}>
            <dt>Email</dt>
            <dd>{data.email}</dd>
            <dt>Status</dt>
            <dd>
              <Badge variant={data.status}>{data.status}</Badge>
            </dd>
            <dt>Balance</dt>
            <dd className={styles.em}>{formatMoney(data.balance_cents)}</dd>
            <dt>Since</dt>
            <dd>{formatDate(data.created_at)}</dd>
          </dl>
        </Card>
        <Card className={styles.wide}>
          <h2 className={styles.h2}>Transactions</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      No transactions for this customer.
                    </td>
                  </tr>
                ) : (
                  data.transactions.map((t) => (
                    <tr key={t.id}>
                      <td className={styles.mono}>{t.reference}</td>
                      <td>
                        <Badge variant={t.type}>
                          {t.type.replace("_", " ")}
                        </Badge>
                      </td>
                      <td>{formatMoney(t.amount_cents, t.currency)}</td>
                      <td>
                        <Badge variant={t.status}>{t.status}</Badge>
                      </td>
                      <td className={styles.desc}>
                        {t.description || "—"}
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
      </div>
    </>
  );
}
