import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "shieldpay_session";

const DEMO_EMAIL = "merchant@demo.com";
const DEMO_PASSWORD = "Demo1234!";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.email ? { email: parsed.email } : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((email, password) => {
    const ok =
      email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() &&
      password === DEMO_PASSWORD;
    if (!ok) return false;
    const u = { email: email.trim() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
