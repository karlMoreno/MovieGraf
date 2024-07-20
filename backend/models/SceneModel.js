const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const driver = require('../database/db');

const createScene = async ({ name, order, projectId }) => {
  const session = driver.session({ database: "neo4j" });
  const sceneId = uuidv4();
  try {
    const result = await session.run(
      'MATCH (p:Project {id: $projectId}) ' +
      'CREATE (s:Scene {id: $sceneId, name: $name, order: $order, belongsTo: $projectId}) ' +
      'CREATE (p)-[:HAS_SCENE]->(s) ' +
      'RETURN s',
      { sceneId, name, order, projectId }
    );
    const scene = result.records[0]?.get('s').properties;
    return scene;
  } finally {
    await session.close();
  }
};

const getSceneById = async (id) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (s:Scene {id: $id}) RETURN s',
      { id }
    );
    const scene = result.records[0]?.get('s').properties;
    return scene;
  } finally {
    await session.close();
  }
};

const getAllScenes = async (projectId) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (p:Project {id: $projectId})-[:HAS_SCENE]->(s:Scene) RETURN s ORDER BY s.order',
      { projectId }
    );
    const scenes = result.records.map(record => record.get('s').properties);
    return scenes;
  } finally {
    await session.close();
  }
};

const updateScene = async (id, { name, order }) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (s:Scene {id: $id}) SET s.name = $name, s.order = $order RETURN s',
      { id, name, order }
    );
    const scene = result.records[0]?.get('s').properties;
    return scene;
  } finally {
    await session.close();
  }
};

const deleteScene = async (id) => {
  const session = driver.session({ database: "neo4j" });
  try {
    await session.run(
      'MATCH (s:Scene {id: $id}) DETACH DELETE s',
      { id }
    );
  } finally {
    await session.close();
  }
};

module.exports = { createScene, getSceneById, getAllScenes, updateScene, deleteScene };
