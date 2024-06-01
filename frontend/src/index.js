import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ThemeProvider from "./functions/ThemeContext";

import { AuthProvider } from "./functions/AuthContext";
import { AdminAuthProvider } from "./functions/AdminAuthContext";
import AdminThemeProvider from "./functions/AdminThemeContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AdminAuthProvider>
        <AdminThemeProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AdminThemeProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
