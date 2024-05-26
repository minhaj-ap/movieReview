import MovieList from "../components/AdminMovieList";
import Header from "../components/AdminHeader";
// import TopMovieList from "../components/AdminTopMovies";

export default function AdminPage() {
  return (
    <div className="page_admin">
      <Header />
      {/* <TopMovieList/> */}
      <MovieList/>
    </div>
  );
}
