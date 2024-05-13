const express = require("express");
const app = express();
const port = 3002;
const cors = require('cors');
const mainRouter = require('./routes/index.js'); 
const driver = require('./database/db.js');

console.log("Starting server...");



app.use(cors()); 
app.use(express.json());
// Log every request to the server:
app.use((req, res, next) => {
  console.log(`Received request on ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
app.use('/api', mainRouter); 

app.get('/graph', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (n)-[r]->(m) RETURN n, r, m');
    console.log(result);
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

app.post('/node', async (req, res) => {
  const { label } = req.body;
  const session = driver.session();
  try {
    await session.run('CREATE (n:Node {label: $label}) RETURN n', { label });
    res.status(201).send('Node created');
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await session.close();
  }
});

app.post('/edge', async (req, res) => {
  const { fromId, toId, label } = req.body;
  const session = driver.session();
  try {
    await session.run('MATCH (a:Node), (b:Node) WHERE id(a) = $fromId AND id(b) = $toId CREATE (a)-[r:RELATES {label: $label}]->(b) RETURN r', {
      fromId,
      toId,
      label
    });
    res.status(201).send('Edge created');
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

