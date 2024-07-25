const neo4j = require("neo4j-driver");
const driver = require("../database/db");

const getGraph = async () => {
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
    return { nodes: Array.from(nodes), edges };
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await session.close();
  }
};

module.exports = { getGraph };
