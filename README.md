# WM1-Project2-Group-10
Here is the full README file, including all details for your Recipe Manager App:

---

# Recipe Manager App

Welcome to the Recipe Manager App! This React-based application allows users to manage their recipes efficiently by creating, viewing, editing, deleting, and organizing them. It uses a JSON-Server to store and manage recipe data and includes various user-friendly features for recipe management.

---

## Table of Contents

1. [Features](#features)
2. [Link to the github page that hosts the website]
3. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
4. [Starting the Application](#starting-the-application)
    - [Running the Servers](#running-the-servers)
5. [Using the Application](#using-the-application)
6. [Project Structure](#project-structure)


---

## Features

- **Recipe Management**:
  - Add recipes with attributes such as title, description, ingredients, preparation steps, tags, difficulty level, and last updated timestamp.
  - Edit or delete recipes.
  - Drag and drop to reorder recipes and persist the new order.
- **Search, Filter, and Sort**:
  - Search recipes by title, description, or ingredients.
  - Filter recipes by tags or difficulty level.
  - Sort recipes by title, difficulty, or last updated timestamp.
- **Sharing**:
  - Select multiple recipes and download their details as a JSON file.
- **Infinite Scrolling**:
  - View more recipes as you scroll down the page.
- **Responsive Design**:
  - A mobile-friendly user interface.
- **Contact Form**:
  - Submit feedback or inquiries via the contact page.

---

## Link to the github page that hosts the website.

[Recipe Manager App](https://github.com/ZakirAghakishiyev/WM1-Project2-Group-10)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (Node Package Manager)

## Starting the Application

### Running the JSON-Server

1. Install JSON-Server globally (if not already installed):
   ```bash
   npm install -g json-server
   ```

2. In the project directory, create a `db.json` file with the following structure:
   ```json
   {
     "recipes": [],
     "messages": []
   }
   ```

3. Start the JSON-Server, as the following comand will directly run the both servers in port 3000 and 3001:
   ```bash
   npm run dev
   ```


## Using the Application

### Home Page
- View a welcome message and an introduction to the app.
- See featured recipes and press button to see its details
- Description and link to previous project.

### Recipe Page
- **Add Recipes**: Fill out the form and click "Add Recipe."
- **Edit Recipes**: Click "Edit" on a recipe card to modify its details.
- **Delete Recipes**: Click "Delete" to remove a recipe.
- **Search**: Use the search bar to find recipes by title, description, or ingredients.
- **Filter**: Filter recipes by tags or difficulty level.
- **Sort**: Sort recipes by title, difficulty level, or last updated date.
- **Reorder**: Drag and drop recipes to rearrange their order. They are also modified in databased with the help of order element of each recipe
- **Share**: Select multiple recipes and send them as a mail. It is directly sent to mail that user wrote by mentioning the name user wants.

### Contact Page
- Submit a subject, email, and message via the form. The data is sent to the JSON-Server and stored under the `messages` endpoint.

---

## Project Structure

```
.
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Home.js
│   │   ├── RecipePage.js
│   │   ├── ContactMe.js
│   ├── styles/
│   │   ├── nav.css
│   │   ├── Home.css
│   │   ├── recipe.css
│   ├── App.js
│   ├── index.js
│   └── db.json (for JSON-Server data)
├── package.json
└── README.md
```

---

