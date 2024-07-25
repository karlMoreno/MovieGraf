const neo4j = require('neo4j-driver');
const driver = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const createTask = async ({ title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail }) => {
  const session = driver.session({ database: "neo4j" });
  const taskId = uuidv4(); // Generate a unique identifier for the task
  try {
    const result = await session.run(
      'CREATE (t:Task {id: $taskId, title: $title, description: $description, assignedTo: $assignedTo, progressState: $progressState, startDate: $startDate, endDate: $endDate, priority: $priority, thumbnail: $thumbnail}) RETURN t',
      { taskId, title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail }
    );
    const task = result.records[0]?.get('t').properties;
    return task;
  } finally {
    await session.close();
  }
};

const getTaskById = async (id) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (t:Task {id: $id}) RETURN t',
      { id }
    );
    const task = result.records[0]?.get('t').properties;
    return task;
  } finally {
    await session.close();
  }
};

const getAllTasks = async () => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run('MATCH (t:Task) RETURN t');
    const tasks = result.records.map(record => record.get('t').properties);
    return tasks;
  } finally {
    await session.close();
  }
};

const updateTask = async (id, { title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail }) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (t:Task {id: $id}) SET t.title = $title, t.description = $description, t.assignedTo = $assignedTo, t.progressState = $progressState, t.startDate = $startDate, t.endDate = $endDate, t.priority = $priority, t.thumbnail = $thumbnail RETURN t',
      { id, title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail }
    );
    const task = result.records[0]?.get('t').properties;
    return task;
  } finally {
    await session.close();
  }
};

const deleteTask = async (id) => {
  const session = driver.session({ database: "neo4j" });
  try {
    await session.run('MATCH (t:Task {id: $id}) DELETE t', { id });
  } finally {
    await session.close();
  }
};

module.exports = { createTask, getTaskById, getAllTasks, updateTask, deleteTask };
