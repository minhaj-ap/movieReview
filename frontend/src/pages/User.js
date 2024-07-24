import Header from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";
export default function UserPage() {
  return (
        <div className="page_user">
          <Header inLink={false} />
          <Hero />
          <List />
        </div>
  );
}
