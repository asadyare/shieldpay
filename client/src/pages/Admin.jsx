import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { Card } from "../components/Card.jsx";
import styles from "./Admin.module.css";

export function Admin() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJson("/api/admin/summary")
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

  return (
    <>
      <PageHeader
        title="Admin"
        subtitle="Operational snapshot: environment, datastore, and transaction mix (read-only in this demo)."
      />

      {error ? (
        <Card>
          <p className={styles.error}>Could not load admin summary.</p>
        </Card>
      ) : !data ? (
        <Card>Loading…</Card>
      ) : (
        <div className={styles.grid}>
          <Card>
            <h2 className={styles.h2}>Environment</h2>
            <dl className={styles.dl}>
              <dt>Node env</dt>
              <dd>
                <code>{data.environment}</code>
              </dd>
              <dt>Database</dt>
              <dd>{data.database}</dd>
            </dl>
          </Card>
          <Card>
            <h2 className={styles.h2}>By status</h2>
            <ul className={styles.list}>
              {data.transactionBreakdown.byStatus.map((r) => (
                <li key={r.status}>
                  <span className={styles.k}>{r.status}</span>
                  <span className={styles.v}>{r.n}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className={styles.h2}>By type</h2>
            <ul className={styles.list}>
              {data.transactionBreakdown.byType.map((r) => (
                <li key={r.type}>
                  <span className={styles.k}>{r.type.replace("_", " ")}</span>
                  <span className={styles.v}>{r.n}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
}
