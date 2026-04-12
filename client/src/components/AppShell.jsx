import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "./AppShell.module.css";

const nav = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/customers", label: "Customers", end: false },
  { to: "/transactions", label: "Transactions", end: true },
  { to: "/admin", label: "Admin", end: true },
  { to: "/settings/export", label: "Settings", end: true },
];

export function AppShell() {
  const { logout, user } = useAuth();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden />
          <div>
            <div className={styles.brandName}>ShieldPay</div>
            <div className={styles.brandTag}>Escrow &amp; payouts</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? styles.navLinkActive : styles.navLink
              }
              end={item.end}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFoot}>
          {user?.email ? (
            <span className={styles.userEmail} title={user.email}>
              {user.email}
            </span>
          ) : null}
          <button type="button" className={styles.signOut} onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
