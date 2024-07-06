const { createScene, getSceneById, getAllScenes, updateScene, deleteScene } = require('../models/scene');

const createSceneHandler = async (req, res) => {
  try {
    const { name, order, projectId } = req.body;
    const scene = await createScene({ name, order, projectId });
    res.status(201).json(scene);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create scene' });
  }
};

const getSceneByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const scene = await getSceneById(id);
    res.status(200).json(scene);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scene' });
  }
};

const getAllScenesHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const scenes = await getAllScenes(projectId);
    res.status(200).json(scenes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scenes' });
  }
};

const updateSceneHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;
    const scene = await updateScene(id, { name, order });
    res.status(200).json(scene);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update scene' });
  }
};

const deleteSceneHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteScene(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete scene' });
  }
};

module.exports = { createSceneHandler, getSceneByIdHandler, getAllScenesHandler, updateSceneHandler, deleteSceneHandler };
