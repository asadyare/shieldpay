import styles from "./Card.module.css";

export function Card({ children, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`.trim()}>{children}</div>
  );
}
