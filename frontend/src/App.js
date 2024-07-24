import "./style.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./AdminComponents/Admin";
import MovieList from "./AdminComponents/AdminMovieList";
import TotalUserAndReviews from "./AdminComponents/AdminUsersAndReview";
import GenresClassify from "./AdminComponents/AdminGenresClassify";
import AdminPage from "./pages/Admin";
import UserPage from "./pages/User";
import MovieDetail from "./MovieDetail";
import SearchPage from "./components/SearchPage";
import Login from "./LoginPage";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<UserPage />} />
          <Route exact path="/login" element={<Login type="user"/>} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search/:key" element={<SearchPage />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<AdminHome />} />
            <Route path="movie/:id" element={<MovieDetail isAdmin={true} />} />
            <Route path="your-movies" element={<MovieList />} />
            <Route path="users-and-reviews" element={<TotalUserAndReviews />} />
            <Route path="your-genres" element={<GenresClassify />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
export default App;
