import "./style.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./AdminComponents/Admin";
import MovieList from "./AdminComponents/AdminMovieList";
import TotalUserAndReviews from "./AdminComponents/AdminTopMovies";
import GenresClassify from "./AdminComponents/AdminGenresClassify";
import AdminPage from "./pages/Admin";
import UserPage from "./pages/User";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<AdminHome />} />
            <Route path="your-movies" element={<MovieList />} />
            <Route path="user-and-reviews" element={<TotalUserAndReviews />} />
            <Route path="your-genres" element={<GenresClassify />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
