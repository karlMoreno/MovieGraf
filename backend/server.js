
/**
 * server.js
 * 
 * This file sets up the Express server for the application. It includes middleware configuration,
 * static file serving, route handling, and database connections.
 *
 * Functionality:
 * - Initializes the Express application.
 * - Configures middleware for CORS, JSON parsing, and URL-encoded data parsing.
 * - Serves static files from the 'uploads' directory.
 * - Uses custom logger middleware for logging requests.
 * - Imports and uses the main router for handling API routes.
 * - Defines a specific endpoint for Neo4j graph data retrieval.
 * - Starts the server on the specified port.
 * 
 * Key Modules:
 * - express: The core framework used to build the server.
 * - cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
 * - path: Utility module for working with file and directory paths.
 * - logger: Custom middleware for logging incoming requests.
 * - driver: Database driver for connecting to Neo4j.
 * - mainRouter: The main router for handling API routes.
 * 
 * Endpoints:
 * - GET /graph: Retrieves and returns graph data from the Neo4j database.
 * 
 * Author: Karl Moreno
 */


const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger'); // Import the logger middleware
// const upload = require('./config/multerConfig'); // Import Multer configuration
const driver = require('./database/db'); // Ensure driver is imported correctly
require('dotenv').config();

const app = express();
const port = 3002;

console.log("Starting server...");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure static files from uploads are accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use custom logger middleware
app.use(logger);

// Import and use routes
const mainRouter = require('./routes');
app.use('/api', mainRouter);

// Graph endpoint
app.get('/graph', async (req, res) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run('MATCH (n)-[r]->(m) RETURN n, r, m');
    const nodes = new Set();
    const edges = [];
    result.records.forEach(record => {
      nodes.add(record.get('n'));
      nodes.add(record.get('m'));
      edges.push(record.get('r'));
    });
    res.json({ nodes: Array.from(nodes), edges });
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await session.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
