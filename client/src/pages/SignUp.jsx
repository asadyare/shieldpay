import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "./SignIn.module.css";

export function SignUp() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create merchant account</h1>
        <p className={styles.hint}>
          Demo only — use Sign in with merchant@demo.com to explore the app.
        </p>
        <Link className={`${styles.createLink} ${styles.backLink}`} to="/signin">
          Back to Sign in
        </Link>
      </div>
    </div>
  );
}
