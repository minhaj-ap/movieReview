import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import List from "./components/List";
import ThemeProvider from "./functions/ThemeContext";
function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Hero />
        <List />
      </div>
    </ThemeProvider>
  );
}

export default App;
