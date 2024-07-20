const neo4j = require("neo4j-driver");
const driver = require("../database/db");
const { v4: uuidv4 } = require("uuid");

const getGraph = async (projectId) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      "MATCH (s:Scene) WHERE s.belongsTo = $projectId RETURN s",
      { projectId }
    );
    const graph = result.records.map((record) => record.get("s").properties);
    return graph;
  } finally {
    await session.close();
  }
};


module.exports = {getGraph};