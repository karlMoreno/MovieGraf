
const neo4j = require("neo4j-driver");

// DRIVER FOR AURADB DATABASE
// const driver = neo4j.driver(
//   "neo4j+s://41fa529a.databases.neo4j.io",
//   neo4j.auth.basic("neo4j", "xMLNL3rvo0CU7hQ2rFwjSZ305b0moKkEGYdAaCDKQFc"),
//   {
//     /* encrypted: 'ENCRYPTION_OFF' */
//   }
// );s

const driver = neo4j.driver(
  'neo4j://localhost:7687', // Adjust this to your Neo4j connection string
  neo4j.auth.basic('neo4j', 'testtest') // Adjust this to your Neo4j credentials
);

// Attempt to verify the database connection
async function verifyConnection() {
  const session = driver.session();
  try {
    // Run a simple query to verify the connection
    await session.run("RETURN 1");
    console.log("Connection to the Neo4j database was successful.")
  } catch (error) {
    console.error("Failed to connect to the Neo4j database:", error.message);
  }
}

// Call the verification function
verifyConnection();


module.exports = driver;