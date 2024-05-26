import { Outlet } from "react-router-dom";
export default function Header() {
  return (
    <>
      <header className="admin">
        <h1>DASHBOARD</h1>
      </header>
      <main className="page_admin">
        <Outlet />
      </main>
    </>
  );
}
