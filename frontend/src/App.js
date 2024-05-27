import "./style.css";
import ThemeProvider from "./functions/ThemeContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/User";
import AdminPage from "./AdminComponents/Admin";
import MovieList from "./AdminComponents/AdminMovieList";
import TotalUserAndReviews from "./AdminComponents/AdminTopMovies";
import GenresClassify from "./AdminComponents/AdminGenresClassify";
import AdminBody from "./pages/AdminBody";
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<UserPage />} />
            <Route path="/admin" element={<AdminBody />}>
              <Route index element={<AdminPage />} />
              <Route path="your-movies" element={<MovieList />} />
              <Route path="user-and-reviews" element={<TotalUserAndReviews />} />
              <Route path="your-genres" element={<GenresClassify />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
