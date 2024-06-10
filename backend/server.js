const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger'); // Import the logger middleware
const upload = require('./config/multerConfig'); // Import Multer configuration
const driver = require('./database/db'); // Ensure driver is imported correctly

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
