import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { RequireAuth } from "./auth/RequireAuth.jsx";
import { AppShell } from "./components/AppShell.jsx";
import { SignIn } from "./pages/SignIn.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Customers } from "./pages/Customers.jsx";
import { CustomerDetail } from "./pages/CustomerDetail.jsx";
import { Transactions } from "./pages/Transactions.jsx";
import { Admin } from "./pages/Admin.jsx";
import { SettingsExport } from "./pages/SettingsExport.jsx";

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<RequireAuth />}>
          <Route element={<ShellLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings/export" element={<SettingsExport />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
