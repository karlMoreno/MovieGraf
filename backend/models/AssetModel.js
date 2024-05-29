const neo4j = require('neo4j-driver');
const driver = require('../database/db');

const createAsset = async ({ name, type, status, file }) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'CREATE (a:Asset {name: $name, type: $type, status: $status, file: $file}) RETURN a',
      { name, type, status, file }
    );
    const asset = result.records[0]?.get('a').properties;
    return asset;
  } finally {
    await session.close();
  }
};

const getAssetById = async (id) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (a:Asset) WHERE ID(a) = $id RETURN a',
      { id: neo4j.int(id) }
    );
    const asset = result.records[0]?.get('a').properties;
    return asset;
  } finally {
    await session.close();
  }
};

const getAllAssets = async () => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run('MATCH (a:Asset) RETURN a');
    const assets = result.records.map(record => record.get('a').properties);
    return assets;
  } finally {
    await session.close();
  }
};

const updateAsset = async (id, { name, type, status, file }) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(
      'MATCH (a:Asset) WHERE ID(a) = $id SET a.name = $name, a.type = $type, a.status = $status, a.file = $file RETURN a',
      { id: neo4j.int(id), name, type, status, file }
    );
    const asset = result.records[0]?.get('a').properties;
    return asset;
  } finally {
    await session.close();
  }
};

const deleteAsset = async (id) => {
  const session = driver.session({ database: "neo4j" });
  try {
    await session.run('MATCH (a:Asset) WHERE ID(a) = $id DELETE a', { id: neo4j.int(id) });
  } finally {
    await session.close();
  }
};

module.exports = { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset };
