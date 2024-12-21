import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Recipe Manager</h1>
      <h2 className='welcome'>Manage your recipes effortlessly and keep them organized!</h2>

      <section className="section">
        <h2>Featured Recipe</h2>
        <article className="article">
          <h3>Chocolate Chip Cookies</h3>
          <p>A classic favorite that is perfect for any occasion.</p>
          <p>
            <strong>Difficulty:</strong> Easy
          </p>
          <Link to="/recipes/2">See full recipe</Link>
        </article>
      </section>

      <section className="section">
        <h2>Our Previous Web and Mobile 1 Project</h2>
        <a
          href="https://github.com/ZakirAghakishiyev/WM1-Project1-Group-10"
          target="_blank"
          rel="noopener noreferrer"
        >
          Project 1: Extension for Job Applications
        </a>
        <p>
          This browser extension simplifies form-filling by automatically inputting
          securely stored information, such as names, addresses, and payment details, into
          online forms for quick and accurate submissions. With customizable profiles and
          a focus on privacy, it enhances productivity and streamlines online interactions
          by reducing manual effort and ensuring seamless transitions between personal and
          professional data.
        </p>
      </section>

      <footer>
        <p>
          © 2024 Recipe Manager. Made with ❤️. Visit our{' '}
          <a href="https://github.com/ZakirAghakishiyev/WM1-Project2-Group-10" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default Home;
