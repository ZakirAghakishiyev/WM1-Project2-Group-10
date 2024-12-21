import React, { useState, useEffect } from "react";
import axios from "axios";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "Easy",
  });

  // Fetch recipes
  useEffect(() => {
    axios.get("http://localhost:3000/recipes")
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  // Handle input changes for creating a new recipe
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  // Add new recipe
  const addRecipe = () => {
    const recipeToAdd = {
      ...newRecipe,
      ingredients: newRecipe.ingredients.split(","),
      steps: newRecipe.steps.split(","),
      tags: newRecipe.tags.split(","),
      lastUpdated: new Date().toISOString(),
    };
    axios.post("http://localhost:3000/recipes", recipeToAdd)
      .then((response) => setRecipes([...recipes, response.data]))
      .catch((error) => console.error("Error adding recipe:", error));
  };

  // Delete recipe
  const deleteRecipe = (id) => {
    axios.delete(`http://localhost:3000/recipes/${id}`)
      .then(() => setRecipes(recipes.filter((recipe) => recipe.id !== id)))
      .catch((error) => console.error("Error deleting recipe:", error));
  };

  // Search, filter, and sort logic
  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((recipe) =>
      filter ? recipe.tags.includes(filter) || recipe.difficulty === filter : true
    )
    .sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "difficulty") return a.difficulty.localeCompare(b.difficulty);
      if (sortOption === "lastUpdated") return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      return 0;
    });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recipes</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {/* Filter */}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
        <option value="Dessert">Dessert</option>
        <option value="Vegetarian">Vegetarian</option>
      </select>

      {/* Sort */}
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="">No Sort</option>
        <option value="title">Sort by Title</option>
        <option value="difficulty">Sort by Difficulty</option>
        <option value="lastUpdated">Sort by Last Updated</option>
      </select>

      {/* Recipe List */}
      <div>
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px" }}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            <p><strong>Last Updated:</strong> {new Date(recipe.lastUpdated).toLocaleString()}</p>
            <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Add Recipe Form */}
      <div>
        <h2>Add New Recipe</h2>
        <input
          name="title"
          placeholder="Title"
          value={newRecipe.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newRecipe.description}
          onChange={handleInputChange}
        />
        <input
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={newRecipe.ingredients}
          onChange={handleInputChange}
        />
        <input
          name="steps"
          placeholder="Steps (comma separated)"
          value={newRecipe.steps}
          onChange={handleInputChange}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={newRecipe.tags}
          onChange={handleInputChange}
        />
        <select
          name="difficulty"
          value={newRecipe.difficulty}
          onChange={handleInputChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button onClick={addRecipe}>Add Recipe</button>
      </div>
    </div>
  );
};

export default RecipePage;
