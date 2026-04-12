import styles from "./Badge.module.css";

const map = {
  active: styles.ok,
  pending: styles.warn,
  suspended: styles.bad,
  completed: styles.ok,
  failed: styles.bad,
  escrow_hold: styles.neutral,
  release: styles.ok,
  refund: styles.warn,
  fee: styles.muted,
};

export function Badge({ children, variant }) {
  const c = map[variant] || styles.neutral;
  return <span className={`${styles.badge} ${c}`.trim()}>{children}</span>;
}
