const neo4j = require("neo4j-driver");
const driver = require("../database/db");

// models/GraphModel.js

const createAsset = async (asset) => {
  const session = driver.session();
  try {
    await session.run(
      `
      MATCH (p:Project {id: $projectId}) 
      MERGE (a:Asset {id: $id}) 
      SET a.name = $name, a.type = $type, a.status = $status, a.x = $x, a.y = $y
      ${asset.file ? ', a.file = $file' : ''}
      MERGE (p)-[:HAS_ASSET]->(a)
      `,
      {
        projectId: asset.projectId,
        id: asset.id,
        name: asset.name,
        type: asset.type,
        status: asset.status,
        x: asset.x,
        y: asset.y,
        ...(asset.file && { file: asset.file }),
      }
    );
    console.log('Asset created or updated and linked to project:', asset);
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
      `
      MATCH (p:Project {id: $projectId}) 
      MERGE (t:Task {id: $id}) 
      SET t.title = $title, t.description = $description, t.assignedTo = $assignedTo, 
          t.priority = $priority, t.progressState = $progressState, 
          t.startDate = $startDate, t.endDate = $endDate, t.x = $x, t.y = $y 
      MERGE (p)-[:HAS_TASK]->(t)
      `,
      {
        projectId: task.projectId,
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
    console.log('Task created or updated and linked to project:', task);
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
    const { sourceId, targetId, type } = relationship;

    // Validate relationship type to prevent injection attacks
    const isValidType = /^[A-Za-z_][A-Za-z0-9_]*$/.test(type);
    if (!isValidType) {
      throw new Error(`Invalid relationship type: ${type}`);
    }

    // Log IDs and type
    console.log(`Creating relationship of type ${type} between nodes with IDs ${sourceId} and ${targetId}`);

    const query = `
      MATCH (a {id: $sourceId}), (b {id: $targetId})
      MERGE (a)-[r:${type}]->(b)
      RETURN r
    `;

    const result = await session.run(query, {
      sourceId,
      targetId,
    });

    if (result.records.length === 0) {
      console.error('No relationship created. Possible missing nodes.');
      throw new Error('Failed to create relationship.');
    }

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
    await session.run('MATCH (a:Asset {id: $id}) DETACH DELETE a', {
      id: parseInt(id),
    });
    console.log('Asset deleted:', id);
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};

const deleteTask = async (session, id) => {
  try {
    await session.run('MATCH (t:Task {id: $id}) DETACH DELETE t', {
      id: parseInt(id),
    });
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
