import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {

    // let element = useRoutes([
    //   { path: "/tv", element: <Tv/>},
    //   { path: "/search", element: <Search/>},
    //   { path:"/", element: <Home />, children: [
    //     { path: '/movies/:movieId'}
    //   ]},
    // ])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}>
          <Route path="/tv/:tvId" element={<Tv/>} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/:contentId" element={<Search />} />
        </Route>
        <Route path="/" element={<Home />} >
          <Route path="/movies/:movieId" element={<Home/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;