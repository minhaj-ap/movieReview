import "./style.css";
import ThemeProvider from "./functions/ThemeContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/User";
import AdminPage from "./pages/Admin";
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<UserPage />} />
            <Route path="/admin/your-movies" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
