const express = require("express");
const app = express();
const port = 3002;
const cors = require('cors');
const bcrypt = require('bcrypt');


const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "testtest"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);
const query = `
  MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
   RETURN distinct rec.title as title LIMIT 20
  `;

const params = { favorite: "The Matrix" };

const session = driver.session({ database: "neo4j" });

app.use(cors()); 



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = driver;