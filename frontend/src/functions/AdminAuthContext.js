// AdminAuthProvider.js
import { createContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

function AdminAuthProvider(props) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const adminLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('admin', true);
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('admin');
  };

  const value = {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
  };

  return <AdminAuthContext.Provider value={value} {...props} />;
}

export { AdminAuthContext, AdminAuthProvider };
