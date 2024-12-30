import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import RecipePage from "./pages/RecipePage";
import Navbar from "./pages/Navbar";
import Detail from './pages/Detail';
import ContactMe from './pages/ContactMe';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/details/:id" element={<Detail />} />
        <Route path="/contactMe" element={<ContactMe />} />
      </Routes>
    </Router>
  );
}

export default App;