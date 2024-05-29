const { createTask, getTaskById, getAllTasks, updateTask, deleteTask } = require('../models/TaskModel');

const createTaskHandler = async (req, res) => {
  try {
    const { title, description, assignedTo, progressState, startDate, endDate, priority } = req.body;
    const thumbnail = req.file ? req.file.filename : null; // Ensure you get the filename
    const task = await createTask({ title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTasksHandler = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTaskHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, progressState, startDate, endDate, priority } = req.body;
    const thumbnail = req.file ? req.file.filename : null; // Ensure you get the filename
    const task = await updateTask(id, { title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTaskHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTask(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTaskHandler,
  getTaskByIdHandler,
  getAllTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
};
