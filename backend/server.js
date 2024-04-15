const express = require('express');
const app = express();
const port =  3001;




const neo4j = require('neo4j-driver');

const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "your_password";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


app.get('/data', async (req, res) => {
    try {
      const result = await session.run('MATCH (n) RETURN n LIMIT 10');
      const records = result.records;
      res.send(records.map(record => record.get('n')));
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  process.on('exit', () => {
    driver.close();
  });