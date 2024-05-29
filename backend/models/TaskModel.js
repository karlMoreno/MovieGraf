const driver = require('../database/db');

const createTask = async ({ title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail }) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'CREATE (t:Task {title: $title, description: $description, assignedTo: $assignedTo, progressState: $progressState, startDate: $startDate, endDate: $endDate, priority: $priority, thumbnail: $thumbnail}) RETURN t',
      { title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail }
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
      'MATCH (t:Task) WHERE ID(t) = $id RETURN t',
      { id: neo4j.int(id) }
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
      'MATCH (t:Task) WHERE ID(t) = $id SET t.title = $title, t.description = $description, t.assignedTo = $assignedTo, t.progressState = $progressState, t.startDate = $startDate, t.endDate = $endDate, t.priority = $priority, t.thumbnail = $thumbnail RETURN t',
      { id: neo4j.int(id), title, description, assignedTo, progressState, startDate, endDate, priority, thumbnail }
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
    await session.run('MATCH (t:Task) WHERE ID(t) = $id DELETE t', { id: neo4j.int(id) });
  } finally {
    await session.close();
  }
};

module.exports = { createTask, getTaskById, getAllTasks, updateTask, deleteTask };
