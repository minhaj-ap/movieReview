import { createContext, useState, useEffect } from "react";
export const AdminThemeContext = createContext();
const AdminThemeProvider = ({ children }) => {
  const [admin_theme, setAdminTheme] = useState("light");
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme");
    if (savedTheme) {
      setAdminTheme(savedTheme);
    }
  }, []);
  const toggleAdminTheme = () => {
    const newTheme = admin_theme === "light" ? "dark" : "light";
    setAdminTheme(newTheme);
    localStorage.setItem("admin_theme", newTheme);
  };
  return (
    <AdminThemeContext.Provider value={{ admin_theme, toggleAdminTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};
export default AdminThemeProvider;
