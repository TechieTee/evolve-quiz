// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ResultsPage from "./pages/ResultsPage";
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<span>Loading...</span>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
