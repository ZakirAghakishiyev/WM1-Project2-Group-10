import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import emailjs from "@emailjs/browser";
import './recipe.css';


const API_URL = "http://localhost:3000/recipes";

const RecipePage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [showSendContainer, setShowSendContainer] = useState(false);
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
            ? editingRecipe.ingredients // Use as-is if already an array
            : editingRecipe.ingredients.split(","), // Split if it's a string
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
            setRecipes(
                recipes.map((recipe) =>
                    recipe.id === id ? response.data : recipe
                )
            );
            setEditingRecipe(null); // Exit edit mode
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    // Calculate global indices
    const globalSourceIndex = (currentPage - 1) * itemsPerPage + result.source.index;
    const globalDestinationIndex = (currentPage - 1) * itemsPerPage + result.destination.index;
  
    // Reorder the recipes in the global array
    const reorderedRecipes = Array.from(recipes);
    const [movedRecipe] = reorderedRecipes.splice(globalSourceIndex, 1);
    reorderedRecipes.splice(globalDestinationIndex, 0, movedRecipe);
  
    // Update the order property based on the new global index
    const updatedRecipes = reorderedRecipes.map((recipe, index) => ({
      ...recipe,
      order: index, // Assign a new order value
    }));
  
    setRecipes(updatedRecipes); // Update the state with the new order
  
    // Save changes to the JSON server
    try {
      for (const recipe of updatedRecipes) {
        await axios.put(`${API_URL}/${recipe.id}`, { ...recipe });
      }
      console.log("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  
 
  const toggleSendContainer = () => {
    setShowSendContainer((prev) => !prev); 
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

    if (!userName || !userEmail || !emailSubject) {
        alert("Please provide your name, the recipient's email, and the email subject!");
        return;
    }

    const recipeJSON = JSON.stringify(selectedRecipes, null, 2);

    // EmailJS parameters
    const emailParams = {
        subject: emailSubject, // Use the subject entered by the user
        to_email: userEmail, // Use the email entered by the user
        message: recipeJSON, // Recipe data
        name: userName, // Include the user's name
    };

    // Send email with attachment using EmailJS
    emailjs.send(
        "service_t42gi2d",  // Your EmailJS Service ID
        "template_076ozhc", // Your EmailJS Template ID
        emailParams,
        "DWeHBjVCPfRSI7hFO" // Your EmailJS User ID
    )
    .then(() => {
        alert("Recipes shared successfully via email!");
    })
    .catch((error) => {
        console.error("Failed to share recipes via email:", error);
        alert("Failed to send email. Please try again.");
    });
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
      <button
        className="toggle-send-button"
        onClick={toggleSendContainer}
      >
        {showSendContainer ? "Close Send Form" : "Open Send Form"}
      </button>
        <p className="note">Note: Select the recipes you want to send and open form</p>  

      {showSendContainer && (
      <div className="send-container">
        <h2>Send Recipes</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter recipient's email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter email subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />
        <button className="share-button" onClick={handleShare}>
          Share Selected Recipes
        </button>

</div>)};

  
      {/* Drag-and-Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="recipes">
    {(provided) => (
      <div
        className="recipe-list"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {currentRecipes
          .sort((a, b) => a.order - b.order) // Sort recipes by the order property
          .map((recipe, index) => (
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
                    <strong>Last Updated:</strong>{" "}
                    {new Date(recipe.lastUpdated).toLocaleString()}
                  </p>
                  <div className="recipe-actions">
                    <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
                    <button onClick={() => setEditingRecipe(recipe)}>Edit</button>
                    {editingRecipe && editingRecipe.id === recipe.id && (
                      <div className="edit-form-container">
                        <input
                          name="title"
                          placeholder="Title"
                          value={editingRecipe.title}
                          onChange={handleEditChange}
                        />
                        <textarea
                          name="description"
                          placeholder="Description"
                          value={editingRecipe.description}
                          onChange={handleEditChange}
                        />
                        <input
                          name="ingredients"
                          placeholder="Ingredients (comma-separated)"
                          value={
                            Array.isArray(editingRecipe.ingredients)
                              ? editingRecipe.ingredients.join(",")
                              : editingRecipe.ingredients
                          }
                          onChange={handleEditChange}
                        />
                        <input
                          name="steps"
                          placeholder="Steps (comma-separated)"
                          value={
                            Array.isArray(editingRecipe.steps)
                              ? editingRecipe.steps.join(",")
                              : editingRecipe.steps
                          }
                          onChange={handleEditChange}
                        />
                        <input
                          name="tags"
                          placeholder="Tags (comma-separated)"
                          value={
                            Array.isArray(editingRecipe.tags)
                              ? editingRecipe.tags.join(",")
                              : editingRecipe.tags
                          }
                          onChange={handleEditChange}
                        />
                        <select
                          name="difficulty"
                          value={editingRecipe.difficulty}
                          onChange={handleEditChange}
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <button onClick={() => updateRecipe(recipe.id)}>Save</button>
                        <button
                          className="cancel-button"
                          onClick={() => setEditingRecipe(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

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
