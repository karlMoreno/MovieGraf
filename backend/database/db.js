
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "testtest"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);

// Attempt to verify the database connection
async function verifyConnection() {
  const session = driver.session();
  try {
    // Run a simple query to verify the connection
    await session.run("RETURN 1");
    console.log("Connection to the Neo4j database was successful.");
  } catch (error) {
    console.error("Failed to connect to the Neo4j database:", error.message);
  } finally {
    await session.close();
  }
}

// Call the verification function
verifyConnection();


module.exports = driver;