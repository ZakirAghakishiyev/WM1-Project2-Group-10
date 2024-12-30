import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

const Home = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from the API
    axios
      .get('http://localhost:3000/recipes') // Replace with your actual API URL
      .then((response) => {
        const recipes = response.data;
        // Randomly select two recipes
        const shuffledRecipes = recipes.sort(() => 0.5 - Math.random());
        setFeaturedRecipes(shuffledRecipes.slice(0, 2)); // Take the first two recipes
      })
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to Recipe Manager</h1>
      <h2 className="welcome">Manage your recipes effortlessly and keep them organized!</h2>

      <section className="section">
        <h2>Featured Recipes</h2>
        <div className="featured-recipes">
          {featuredRecipes.length > 0 ? (
            featuredRecipes.map((recipe) => (
              <article className="article" key={recipe.id}>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <p>
                  <strong>Difficulty:</strong> {recipe.difficulty}
                </p>
                <Link to={`/details/${recipe.id}`}>See full recipe</Link>
              </article>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
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
          <a
            href="https://github.com/ZakirAghakishiyev/WM1-Project2-Group-10"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default Home;
