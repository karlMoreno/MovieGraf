
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "testtest"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);

module.exports = driver;