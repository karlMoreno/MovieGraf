// GraphController.js

const driver = require('../database/db'); // Import the Neo4j driver
const {
  createAsset,
  createTask,
  createRelationship,
  deleteAsset,
  deleteTask, // Ensure this line is present
} = require('../models/GraphModel');



exports.saveGraph = async (req, res) => {
  const { assets, tasks, relationships } = req.body;

  try {
    // Save assets
    for (const asset of assets) {
      await createAsset(asset);
    }

    // Save tasks
    for (const task of tasks) {
      await createTask(task);
    }

    // Save relationships
    for (const relationship of relationships) {
      await createRelationship(relationship);
    }

    res.status(200).send('Graph saved successfully');
  } catch (error) {
    console.error('Error saving graph:', error);
    res.status(500).send('Error saving graph');
  }
};

exports.getGraph = async (req, res) => {
  const session = driver.session();

  function convertNeo4jValue(value) {
    if (value && typeof value.toNumber === 'function') {
      return value.toNumber();
    }
    return value;
  }

  try {
    // Fetch assets
    const assetResult = await session.run('MATCH (a:Asset) RETURN a');

    const assets = assetResult.records.map(record => {
      const node = record.get('a');
      const labels = node.labels; // Get labels from the node
      return {
        id: convertNeo4jValue(node.properties.id),
        name: node.properties.name,
        type: node.properties.type, // e.g., 'Character'
        status: node.properties.status,
        file: node.properties.file,
        x: convertNeo4jValue(node.properties.x),
        y: convertNeo4jValue(node.properties.y),
        labels: labels, // Add labels to the node data
      };
    });

    // Fetch tasks
    const taskResult = await session.run('MATCH (t:Task) RETURN t');

    const tasks = taskResult.records.map(record => {
      const node = record.get('t');

      // Console logs
      console.log('Task Node:', node);
      console.log('Type of node.properties.id:', typeof node.properties.id);
      console.log('node.properties.id:', node.properties.id);

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

    // Fetch relationships
    const relationshipResult = await session.run(
      'MATCH (a)-[r]->(b) RETURN id(r) as id, type(r) as type, a.id as sourceId, b.id as targetId'
    );

    const relationships = relationshipResult.records.map(record => {
      // Console logs
      console.log('Relationship Record:', record);
      console.log('Type of record.get("id"):', typeof record.get('id'));
      console.log('record.get("id"):', record.get('id'));

      return {
        id: convertNeo4jValue(record.get('id')),
        type: record.get('type'),
        sourceId: convertNeo4jValue(record.get('sourceId')),
        targetId: convertNeo4jValue(record.get('targetId')),
      };
    });

    // Send the data back to the client
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
