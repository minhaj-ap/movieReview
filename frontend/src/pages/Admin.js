import AdminBody from "./AdminBody";
import { useContext } from "react";
import { AdminAuthContext } from "../functions/AdminAuthContext";
import Login from "../LoginPage";
export default function AdminPage() {
  const { isAdminLoggedIn } = useContext(AdminAuthContext);
  return <>{isAdminLoggedIn ? <AdminBody /> : <Login type="admin" />}</>;
}
