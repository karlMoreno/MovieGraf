const neo4j = require('neo4j-driver');
const driver = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const createTask = async ({ name, type, status, file }) => {
  const session = driver.session({ database: "neo4j" });
  const taskId = uuidv4();
  try {
    const result = await session.run(
      'CREATE (t:Task {id: $taskId, name: $name, type: $type, status: $status, file: $file}) RETURN t',
      { taskId, name, type, status, file }
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

const updateTask = async (id, { name, type, status, file }) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (t:Task {id: $id}) SET t.name = $name, t.type = $type, t.status = $status, t.file = $file RETURN t',
      { id, name, type, status, file }
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
