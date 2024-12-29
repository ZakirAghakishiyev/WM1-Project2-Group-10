import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Detail.css';

const Detail = () => {
  const { id } = useParams(); // Extract the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    // Fetch the recipe details based on the ID
    axios
      .get(`http://localhost:3000/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data);
      })
      .catch((error) => console.error('Error fetching recipe details:', error));
  }, [id]);

  if (!recipe) {
    return <p>Loading recipe details...</p>;
  }

  return (
    <div className="detail-container">
    <div className="recipe-container">
      <h1>{recipe.title}</h1>
      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
      <p><strong>Last Updated:</strong> {new Date(recipe.lastUpdated).toLocaleString()}</p>
      
      <div>
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Preparation Steps:</h3>
        <ol>
          {recipe.steps && recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h3>Tags:</h3>
        <p>{recipe.tags && recipe.tags.join(', ')}</p>
      </div>
    </div>
    </div>
  );
};

export default Detail;
