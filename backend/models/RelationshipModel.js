const neo4j = require('neo4j-driver');
const driver = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const createRelationship = async ({ sourceId, targetId, type }) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (a {id: $sourceId}), (b {id: $targetId}) CREATE (a)-[r:RELATIONSHIP {id: $id, type: $type}]->(b) RETURN r',
      { sourceId, targetId, type, id: uuidv4() }
    );
    const relationship = result.records[0]?.get('r').properties;
    return relationship;
  } finally {
    await session.close();
  }
};

module.exports = { createRelationship };
