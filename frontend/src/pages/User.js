import Header from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";
import { useContext } from "react";
import { AuthContext } from "../functions/AuthContext";
import Login from "../LoginPage";
export default function UserPage() {
  const { isLoggedIn } = useContext(AuthContext);
  console.log(isLoggedIn)
  return (
    <>
      {isLoggedIn ? (
        <div className="page_user">
          <Header inLink={false}/>
          <Hero />
          <List />
        </div>
      ) : (
        <Login type="user" />
      )}
    </>
  );
}
