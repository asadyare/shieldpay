import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "./SignIn.module.css";

export function SignIn() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!login(email, password)) {
      setError("Invalid email or password.");
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.hint}>
          Demo: merchant@demo.com / Demo1234!
        </p>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label} htmlFor="signin-email">
            Email
          </label>
          <input
            id="signin-email"
            className={styles.input}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className={styles.label} htmlFor="signin-password">
            Password
          </label>
          <input
            id="signin-password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className={styles.error}>{error}</p> : null}
          <button type="submit" className={styles.submit}>
            Continue
          </button>
        </form>
        <Link className={styles.createLink} to="/signup">
          Create merchant account
        </Link>
      </div>
    </div>
  );
}
