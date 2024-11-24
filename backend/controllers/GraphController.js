// GraphController.js

const driver = require('../database/db'); // Import the Neo4j driver
const {
  createAsset,
  createTask,
  createRelationship,
  deleteAsset,
  deleteTask, // Ensure this line is present
} = require('../models/GraphModel');

const jwt = require('jsonwebtoken');


exports.saveGraph = async (req, res) => {
  const { assets, tasks, relationships, projectId } = req.body;

  try {
    // Log incoming data for debugging
    console.log('Saving graph for projectId:', projectId);
    console.log('Assets:', assets);
    console.log('Tasks:', tasks);
    console.log('Relationships:', relationships);

    // Save assets
    for (const asset of assets) {
      console.log(`Saving asset: ${JSON.stringify(asset)}`);
      await createAsset({ ...asset, projectId }); // Include projectId in asset
    }

    // Save tasks
    for (const task of tasks) {
      console.log(`Saving task: ${JSON.stringify(task)}`);
      await createTask({ ...task, projectId }); // Include projectId in task
    }

    // Save relationships
    for (const relationship of relationships) {
      console.log(`Saving relationship: ${JSON.stringify(relationship)}`);
      await createRelationship({ ...relationship, projectId }); // Include projectId in relationship
    }

    res.status(200).json({ message: 'Graph saved successfully' });
  } catch (error) {
    console.error('Error saving graph:', error.message);
    res.status(500).json({ error: 'Failed to save graph' });
  }
};

exports.getGraph = async (req, res) => {
  const session = driver.session();
  const { projectId } = req.query; // Extract projectId from query parameters

  function convertNeo4jValue(value) {
    if (value && typeof value.toNumber === 'function') {
      return value.toNumber();
    }
    return value;
  }

  try {
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    // Fetch assets associated with the projectId
    const assetResult = await session.run(
      `
      MATCH (p:Project {id: $projectId})-[:HAS_ASSET]->(a:Asset)
      RETURN a
      `,
      { projectId }
    );

    const assets = assetResult.records.map(record => {
      const node = record.get('a');
      return {
        id: convertNeo4jValue(node.properties.id),
        name: node.properties.name,
        type: node.properties.type,
        status: node.properties.status,
        file: node.properties.file,
        x: convertNeo4jValue(node.properties.x),
        y: convertNeo4jValue(node.properties.y),
      };
    });

    // Fetch tasks associated with the projectId
    const taskResult = await session.run(
      `
      MATCH (p:Project {id: $projectId})-[:HAS_TASK]->(t:Task)
      RETURN t
      `,
      { projectId }
    );

    const tasks = taskResult.records.map(record => {
      const node = record.get('t');
      return {
        id: convertNeo4jValue(node.properties.id),
        title: node.properties.title,
        description: node.properties.description,
        assignedTo: node.properties.assignedTo,
        priority: node.properties.priority,
        progressState: node.properties.progressState,
        startDate: node.properties.startDate,
        endDate: node.properties.endDate,
        x: convertNeo4jValue(node.properties.x),
        y: convertNeo4jValue(node.properties.y),
      };
    });

    // Fetch relationships between nodes associated with the projectId
    const relationshipResult = await session.run(
      `
      MATCH (p:Project {id: $projectId})
      MATCH (p)-[:HAS_ASSET|:HAS_TASK]->(a)-[r]->(b)<-[:HAS_ASSET|:HAS_TASK]-(p)
      RETURN id(r) as id, type(r) as type, a.id as sourceId, b.id as targetId
      `,
      { projectId }
    );

    const relationships = relationshipResult.records.map(record => {
      return {
        id: convertNeo4jValue(record.get('id')),
        type: record.get('type'),
        sourceId: convertNeo4jValue(record.get('sourceId')),
        targetId: convertNeo4jValue(record.get('targetId')),
      };
    });

    // Send the filtered graph data back to the client
    res.status(200).json({
      assets,
      tasks,
      relationships,
    });
  } catch (error) {
    console.error('Error fetching graph:', error);
    res.status(500).send('Error fetching graph');
  } finally {
    await session.close();
  }
};

exports.deleteNode = async (req, res) => {
  const session = driver.session();
  const { id, nodeType } = req.params;

  try {
    if (nodeType === 'Asset') {
      await deleteAsset(session, id);
    } else if (nodeType === 'Task') {
      await deleteTask(session, id);
    } else {
      res.status(400).send('Invalid node type');
      return;
    }
    res.status(200).send('Node deleted successfully');
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).send('Error deleting node');
  } finally {
    await session.close();
  }
};
