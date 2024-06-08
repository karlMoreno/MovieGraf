# MovieGraf

MovieGraf is a web application designed to provide comprehensive insights into the world of movies. It integrates with Neo4j to deliver powerful data visualizations and user-driven analytics.

## Getting Started

These instructions will guide you through setting up your local development environment. Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: This project requires Node.js. If it's not installed, download and install it from [Node.js official website](https://nodejs.org/).

### Installation

Follow these steps to set up your local development environment:

#### Clone the Repository

Start by cloning the repository and navigating into the project directory:

```bash
git clone https://github.com/karlMoreno/MovieGraf.git
cd MovieGraf
npm install --save neo4j-driver
```

### Set Up the Backend

To get the backend up and running, follow these steps:

1. **Navigate to the Backend Directory:**

   Open your terminal and execute the following commands to enter the backend directory of your project:

   ```bash
   cd backend

   npm install

   node server.js

   npm install bcrypt

   npm install cors

   npm install bcrypt

   npm install multer

   npm install jsonwebtoken




   ```

### Set Up the Frontend

To get the frontend up and running, follow these steps:

1. **Open a New Terminal Window:**

   It's important to keep the backend server running while you set up the frontend. Therefore, open a new terminal window or tab to continue with the frontend setup.

2. **Navigate to the Frontend Directory:**

   Use the following command to navigate to the frontend directory of your project:

   ```bash
   cd ../frontend

   npm install

   npm start


   npm install @mui/material @mui/icons-material

   npm install @emotion/react @emotion/styled

   npm install react-router-domv

   npm install @mui/x-charts

   npm install react-virtuoso

   npm install @mui/icons-material

   

   npm install @mui/x-date-pickers
   npm install date-fns@2
   npm install @mui/x-date-pickers @mui/lab date-fns

   npm install three @react-three/fiber
   npm install @react-three/drei
   npm install react-beautiful-dnd

   npm install antd

   npm install @mui/x-data-grid
   npm install uuid


   ```



# Application Overview

This application is a Node.js web application that uses Neo4j for data storage. It includes user authentication, project management, and a structured route system.

- **Database**: Neo4j
- **Backend Framework**: Express
- **Authentication**: JWT (JSON Web Tokens)

## Structure

- **models**: Contains the database models
- **controllers**: Contains the business logic
- **routes**: Contains the API routes
- **middleware**: Contains the authentication middleware


# Workflow

## Step 1: User Sign-Up
1. User sends a POST request to `/signup` with firstName, lastName, email, and password.
2. The `createUser` function hashes the password and stores the user in the database.
3. A success message and the created user are returned.

## Step 2: User Sign-In
1. User sends a POST request to `/signin` with email and password.
2. The `signInUser` function verifies the credentials and returns a JWT and user ID.
3. The JWT is stored on the client-side for future requests.

## Step 3: Creating a Project
1. Authenticated user sends a POST request to `/projects` with project details.
2. The `createProject` function creates a project and associates it with the user.
3. A success message and the created project are returned.

## Step 4: Retrieving Projects
1. Authenticated user sends a GET request to `/projects`.
2. The `getUserProjects` function retrieves all projects for the user.
3. The projects are returned and displayed on the client-side.


