import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css'

const Navbar = () => {
  return (
    <nav >
      <Link to="/">Home</Link>
      <Link to="/recipes" className='two'>Recipes</Link>
      <Link to="/contactMe">Contact Me</Link>
    </nav>
  );
};

export default Navbar;
