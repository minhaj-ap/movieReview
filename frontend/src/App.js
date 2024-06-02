import "./style.css";
import { useContext } from "react";
import { Navigate, BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./AdminComponents/Admin";
import MovieList from "./AdminComponents/AdminMovieList";
import TotalUserAndReviews from "./AdminComponents/AdminUsersAndReview";
import GenresClassify from "./AdminComponents/AdminGenresClassify";
import AdminPage from "./pages/Admin";
import UserPage from "./pages/User";
import MovieDetail from "./MovieDetail";
import { AuthContext } from "./functions/AuthContext";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<UserPage />} />
          <Route path="/movie/:id" element={CheckAuth(MovieDetail)} />
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
  function CheckAuth(Element) {
    const { isLoggedIn, loading } = useContext(AuthContext);
    if (loading) {
      return <div>Loading...</div>; // Or any loading indicator
    }
    return isLoggedIn ? <Element /> : <Navigate to="/" />;
  }
}
export default App;
