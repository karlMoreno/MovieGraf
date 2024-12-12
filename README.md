# MovieGraf

## 🎬 Under Construction

MovieGraf is a web application designed to provide comprehensive insights into the world of movies. It integrates with Neo4j to deliver powerful data visualizations and user-driven analytics.

---

## Getting Started 🚀

These instructions will guide you through setting up your local development environment. Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Node.js**: Download and install from [Node.js official website](https://nodejs.org/).
- **Git**: Required for cloning the repository.

---

## Installation 🛠️

### Step 1: Clone the Repository

```bash
# Clone the repository
$ git clone https://github.com/karlMoreno/MovieGraf.git

# Navigate to the project directory
$ cd MovieGraf

# Install Neo4j driver dependency
$ npm install --save neo4j-driver
```

### Step 2: Set Up the Backend

```bash
# Navigate to the backend directory
$ cd backend

# Install backend dependencies
$ npm install

# Start the backend server
$ node server.js

# Additional dependencies
$ npm install bcrypt cors multer jsonwebtoken
```

### Step 3: Set Up the Frontend

```bash
# Navigate to the frontend directory
$ cd ../frontend

# Install frontend dependencies
$ npm install

# Start the development server
$ npm start

# Additional libraries
$ npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-router-dom @mui/x-charts
$ npm install react-virtuoso d3 @mui/x-date-pickers date-fns three @react-three/fiber @react-three/drei react-beautiful-dnd
$ npm install antd @mui/x-data-grid uuid react-dnd react-dnd-html5-backend react-bootstrap bootstrap
```

---

## Oleg's Workspace 🛠️

### Welcome, Oleg! 👋

As the new developer on the project, your main focus will be on the **Landing Page**. Follow these steps to get started:

1. **Branch Setup:**
   - Work on the `development` branch.
   - If you encounter merge conflicts with `main`, you can resolve it by overriding `main` with `development`. Otherwise, you can leave the conflict and focus on your tasks.

2. **File Location:**
   - Navigate to:
     ```bash
     frontend/src/pages/LandingPage.jsx
     ```

3. **Library in Use:**
   - We are using **Material-UI** for components and styling.
   - Refer to the Material-UI documentation for guidance: [Material-UI](https://mui.com/).

4. **Focus:**
   - Your main responsibility is the Landing Page. Feel free to explore and experiment with the Material-UI library to create an engaging and dynamic user interface.

---

## Application Overview 📊

This application is a Node.js web application that uses Neo4j for data storage. It includes user authentication, project management, and a structured route system.

### Tech Stack:
- **Database:** Neo4j
- **Backend Framework:** Express
- **Authentication:** JWT (JSON Web Tokens)

### Structure:
- **models**: Contains the database models
- **controllers**: Contains the business logic
- **routes**: Contains the API routes
- **middleware**: Contains the authentication middleware

---

## Workflow 🔄

### User Actions:

1. **User Sign-Up**
   - Sends a POST request to `/signup` with firstName, lastName, email, and password.
   - The `createUser` function hashes the password and stores the user in the database.

2. **User Sign-In**
   - Sends a POST request to `/signin` with email and password.
   - The `signInUser` function verifies the credentials and returns a JWT and user ID.

3. **Creating a Project**
   - Authenticated user sends a POST request to `/projects` with project details.
   - The `createProject` function creates a project and associates it with the user.

4. **Retrieving Projects**
   - Authenticated user sends a GET request to `/projects`.
   - The `getUserProjects` function retrieves all projects for the user.

---

## Tech Debt 🏗️

> **“He who pays his debts gets richer.”** – French Proverb

This section outlines the current technical debt within the project and tasks that need to be addressed:

1. **User Management:**
   - Add users via email.
   - Allow users to own or collaborate on projects.
   - Add functionality to delete users and their projects.

2. **Authentication Improvements:**
   - Add robust email validation for sign-up.
   - Ensure secure user sessions.

3. **API Configuration:**
   - Move APIs to work on a live server with `.env` configurations.

4. **UI/UX Enhancements:**
   - Add loading indicators and improve user navigation.
   - Enhance accessibility and responsiveness.

Feel free to update this list as the project progresses!

---

Happy coding, Oleg! 🎉
