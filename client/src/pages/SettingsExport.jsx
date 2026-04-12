import { PageHeader } from "../components/PageHeader.jsx";
import { Card } from "../components/Card.jsx";
import styles from "./SettingsExport.module.css";

export function SettingsExport() {
  return (
    <>
      <PageHeader
        title="Export data"
        subtitle="Download CSV snapshots for reconciliation, backups, or migration. Files are generated on demand from SQLite."
      />
      <div className={styles.grid}>
        <Card>
          <h2 className={styles.h2}>Customers</h2>
          <p className={styles.p}>
            All customer records: id, name, email, company, status, balance,
            created timestamp.
          </p>
          <a
            className={styles.btn}
            href="/api/export/customers.csv"
            download
          >
            Download customers.csv
          </a>
        </Card>
        <Card>
          <h2 className={styles.h2}>Transactions</h2>
          <p className={styles.p}>
            Full ledger with customer email, reference, type, amounts, status,
            and timestamps.
          </p>
          <a
            className={styles.btn}
            href="/api/export/transactions.csv"
            download
          >
            Download transactions.csv
          </a>
        </Card>
      </div>
      <Card className={styles.note}>
        <strong>Note:</strong> In development, the Vite dev server proxies{" "}
        <code>/api</code> to the Express API on port 3001, so these links work
        from the browser. For production, build the client and run{" "}
        <code>npm start</code> from the repo root to serve the app and API
        together.
      </Card>
    </>
  );
}
