import "./style.css";
import ThemeProvider from "./functions/ThemeContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/User";
import AdminPage from "./pages/Admin";
import MovieList from "./components/AdminMovieList";
import Header from "./components/AdminHeader";
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<UserPage />} />
            <Route path="/admin" element={<Header />}>
              <Route index element={<AdminPage />} />
              <Route path="your-movies" element={<MovieList />} />
              {/* <Route path="settings" element={<AdminSettings />} /> */}
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
