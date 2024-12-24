import React, { useState, useEffect } from "react";
import axios from "axios";
import './recipe.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InfiniteScroll from "react-infinite-scroll-component";
import emailjs from "@emailjs/browser";


const API_URL = "http://localhost:3000/recipes";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "Easy",
  });
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingRecipe({ ...editingRecipe, [name]: value });
  };

  const addRecipe = () => {
    const recipeToAdd = {
      ...newRecipe,
      ingredients: newRecipe.ingredients.split(","),
      steps: newRecipe.steps.split(","),
      tags: newRecipe.tags.split(","),
      lastUpdated: new Date().toISOString(),
    };
    axios
      .post(API_URL, recipeToAdd)
      .then((response) => setRecipes([...recipes, response.data]))
      .catch((error) => console.error("Error adding recipe:", error));
  };

  const deleteRecipe = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setRecipes(recipes.filter((recipe) => recipe.id !== id)))
      .catch((error) => console.error("Error deleting recipe:", error));
  };

  const updateRecipe = (id) => {
    const updatedRecipe = {
      ...editingRecipe,
      ingredients: Array.isArray(editingRecipe.ingredients)
        ? editingRecipe.ingredients
        : editingRecipe.ingredients.split(","),
      steps: Array.isArray(editingRecipe.steps)
        ? editingRecipe.steps
        : editingRecipe.steps.split(","),
      tags: Array.isArray(editingRecipe.tags)
        ? editingRecipe.tags
        : editingRecipe.tags.split(","),
      lastUpdated: new Date().toISOString(),
    };

    axios
      .put(`${API_URL}/${id}`, updatedRecipe)
      .then((response) => {
        setRecipes(recipes.map((recipe) => (recipe.id === id ? response.data : recipe)));
        setEditingRecipe(null);
      })
      .catch((error) => console.error("Error updating recipe:", error));
  };

  const filteredRecipes = recipes
  .filter((recipe) => {
    const titleMatch = recipe.title?.toLowerCase().includes(search.toLowerCase());
    const descriptionMatch = recipe.description?.toLowerCase().includes(search.toLowerCase());
    return titleMatch || descriptionMatch;
  })
  .filter((recipe) => {
    const tagsMatch = Array.isArray(recipe.tags) && recipe.tags.includes(filter);
    const difficultyMatch = recipe.difficulty === filter;
    return filter ? tagsMatch || difficultyMatch : true;
  })
  .sort((a, b) => {
    if (sortOption === "title") return a.title?.localeCompare(b.title) || 0;
    if (sortOption === "difficulty") return a.difficulty?.localeCompare(b.difficulty) || 0;
    if (sortOption === "lastUpdated") {
      const dateA = new Date(a.lastUpdated);
      const dateB = new Date(b.lastUpdated);
      return dateB - dateA; 
    }
    return 0; 
  });


  const toggleExpandRecipe = (id) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedRecipes = Array.from(recipes);
    const [moved] = reorderedRecipes.splice(result.source.index, 1);
    reorderedRecipes.splice(result.destination.index, 0, moved);

    setRecipes(reorderedRecipes);

    fetch('http://localhost:3000/recipes/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reorderedRecipes),
    });
  };

  const toggleRecipeSelection = (id) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === id ? { ...recipe, isSelected: !recipe.isSelected } : recipe
      )
    );
  };

  const handleShare = () => {
    const selectedRecipes = recipes.filter((recipe) => recipe.isSelected);

    if (selectedRecipes.length === 0) {
      alert("No recipes selected to share!");
      return;
    }

    const recipeJSON = JSON.stringify(selectedRecipes, null, 2);

    const blob = new Blob([recipeJSON], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "selected_recipes.json";
    link.click();

    console.log("Recipes shared as JSON:", recipeJSON);
  };


  const loadMoreRecipes = async () => {
    const response = await fetch(`http://localhost:3000/recipes?_page=${currentPage}&_limit=10`);
    const newRecipes = await response.json();
    setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
    setCurrentPage(currentPage + 1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Calculate recipes to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Generate pagination buttons
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  

  return (
    <div className="recipe-container">
      <h1>Recipes</h1>
  
      {/* Search, Filter, and Sort Options */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">No Sort</option>
          <option value="title">Sort by Title</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="lastUpdated">Sort by Last Updated</option>
        </select>
      </div>
  
      {/* Share Selected Recipes Button */}
      <button className="share-button" onClick={handleShare}>
        Share Selected Recipes
      </button>
  
      {/* Drag-and-Drop Context */}
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
  
          // Adjust currentRecipes and recipes during drag-and-drop
          const reorderedRecipes = Array.from(currentRecipes);
          const [movedItem] = reorderedRecipes.splice(result.source.index, 1);
          reorderedRecipes.splice(result.destination.index, 0, movedItem);
  
          const globalIndex = (currentPage - 1) * itemsPerPage + result.destination.index;
  
          const updatedRecipes = Array.from(recipes);
          updatedRecipes.splice(globalIndex, 1, movedItem);
  
          setRecipes(updatedRecipes);
        }}
      >
        <Droppable droppableId="recipes">
          {(provided) => (
            <div
              className="recipe-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {currentRecipes.map((recipe, index) => (
                <Draggable
                  key={recipe.id}
                  draggableId={recipe.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="recipe-card"
                    >
                      <label className="recipe-select-label">
                        <input
                          type="checkbox"
                          checked={recipe.isSelected || false}
                          onChange={() => toggleRecipeSelection(recipe.id)}
                          className="recipe-checkbox"
                        />
                        <span className="checkbox-custom"></span>
                        Select
                      </label>
  
                      <h3>{recipe.title}</h3>
                      <p>{recipe.description}</p>
                      <p>
                        <strong>Difficulty:</strong> {recipe.difficulty}
                      </p>
                      <p>
                        <strong>Last Updated:</strong> {new Date(recipe.lastUpdated).toLocaleString()}
                      </p>
                      <div className="recipe-actions">
                        <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
                        <button onClick={() => setEditingRecipe(recipe)}>Edit</button>
                        <button onClick={() => toggleExpandRecipe(recipe.id)}>
                          {expandedRecipe === recipe.id ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                      {expandedRecipe === recipe.id && (
                        <div className="recipe-details">
                          <h4>Ingredients:</h4>
                          <ul>
                            {recipe.ingredients.map((ingredient, idx) => (
                              <li key={idx}>{ingredient}</li>
                            ))}
                          </ul>
                          <h4>Steps:</h4>
                          <ol>
                            {recipe.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                          <h4>Tags:</h4>
                          <p>{recipe.tags.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
  
      {/* Pagination Controls */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
  
      {/* Form to Add New Recipes */}
      <div className="form-container">
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
