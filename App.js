import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipePage />} />
      </Routes>
    </Router>
  );
}

export default App;
