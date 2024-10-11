const neo4j = require("neo4j-driver");
const driver = require("../database/db");

// models/GraphModel.js

const createAsset = async (asset) => {
  const session = driver.session();
  try {
    await session.run(
      'MERGE (a:Asset {id: $id}) ' +
        'SET a.name = $name, a.type = $type, a.status = $status, a.x = $x, a.y = $y' +
        (asset.file ? ', a.file = $file' : ''),
      {
        id: asset.id,
        name: asset.name,
        type: asset.type,
        status: asset.status,
        x: asset.x,
        y: asset.y,
        ...(asset.file && { file: asset.file }),
      }
    );
    console.log('Asset created or updated:', asset);
  } catch (error) {
    console.error('Error creating or updating asset:', error);
    throw error;
  } finally {
    await session.close();
  }
};

const createTask = async (task) => {
  const session = driver.session();
  try {
    await session.run(
      'MERGE (t:Task {id: $id}) ' +
        'SET t.title = $title, t.description = $description, t.assignedTo = $assignedTo, t.priority = $priority, t.progressState = $progressState, t.startDate = $startDate, t.endDate = $endDate, t.x = $x, t.y = $y',
      {
        id: task.id,
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        priority: task.priority,
        progressState: task.progressState,
        startDate: task.startDate,
        endDate: task.endDate,
        x: task.x,
        y: task.y,
      }
    );
    console.log('Task created or updated:', task);
  } catch (error) {
    console.error('Error creating or updating task:', error);
    throw error;
  } finally {
    await session.close();
  }
};

const createRelationship = async (relationship) => {
  const session = driver.session();
  try {
    await session.run(
      'MATCH (a {id: $sourceId}), (b {id: $targetId}) ' +
        'MERGE (a)-[r:' + relationship.type + ']->(b) ' +
        'RETURN r',
      {
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }
    );
    console.log('Relationship created or matched:', relationship);
  } catch (error) {
    console.error('Error creating relationship:', error);
    throw error;
  } finally {
    await session.close();
  }
};


const deleteAsset = async (session, id) => {
  try {
    await session.run(
      'MATCH (a:Asset {id: $id}) DETACH DELETE a',
      { id: parseInt(id) }
    );
    console.log('Asset deleted:', id);
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};

const deleteTask = async (session, id) => {
  try {
    await session.run(
      'MATCH (t:Task {id: $id}) DETACH DELETE t',
      { id: parseInt(id) }
    );
    console.log('Task deleted:', id);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

module.exports = {
  createAsset,
  createTask,
  createRelationship,
  deleteAsset,
  deleteTask,
};