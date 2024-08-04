const { createAsset } = require('../models/AssetModel');
const { createTask } = require('../models/TaskModel');
const { createRelationship } = require('../models/RelationshipModel');

exports.saveGraph = async (req, res) => {
  const { assets, tasks, relationships } = req.body;

  try {
    // Process assets
    for (const asset of assets) {
      await createAsset(asset);
    }

    // Process tasks
    for (const task of tasks) {
      await createTask(task);
    }

    // Process relationships
    for (const relationship of relationships) {
      await createRelationship(relationship);
    }

    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
};
