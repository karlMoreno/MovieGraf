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




   ```



### For Interacting with neo4j desktop here are some useful queries

Query to View All Nodes and Relationships

````bash
   // this is for Finding everything in the database
   MATCH (n)
   OPTIONAL MATCH (n)-[r]->(m)
   RETURN n, r, m


    ```
````
