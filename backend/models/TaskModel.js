const neo4j = require('neo4j-driver');
const driver = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const createTask = async ({
  id,
  title,
  description,
  assignedTo,
  progressState,
  startDate,
  endDate,
  priority,
  files,
}) => {
  const session = driver.session({ database: 'neo4j' });
  try {
    const result = await session.run(
      `
      CREATE (t:Task {
        id: $id,
        title: $title,
        description: $description,
        assignedTo: $assignedTo,
        progressState: $progressState,
        startDate: CASE WHEN $startDate IS NULL THEN NULL ELSE $startDate END,
        endDate: CASE WHEN $endDate IS NULL THEN NULL ELSE $endDate END,
        priority: $priority,
        files: $files
      })
      RETURN t
      `,
      {
        id,
        title,
        description,
        assignedTo,
        progressState,
        startDate: startDate || null, // Ensure explicit null is passed
        endDate: endDate || null, // Ensure explicit null is passed
        priority,
        files,
      }
    );

    return result.records[0]?.get('t').properties;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
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
