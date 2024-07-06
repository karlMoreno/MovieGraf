const neo4j = require('neo4j-driver');
const driver = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const createAsset = async ({ name, type, status, file }) => {
  const session = driver.session({ database: "neo4j" });
  const id = uuidv4(); // Generate a UUID for the new asset
  try {
    const result = await session.run(
      'CREATE (a:Asset {id: $id, name: $name, type: $type, status: $status, file: $file}) RETURN a',
      { id, name, type, status, file }
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
      'MATCH (a:Asset {id: $id}) RETURN a',
      { id }
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
      'MATCH (a:Asset {id: $id}) SET a.name = $name, a.type = $type, a.status = $status, a.file = $file RETURN a',
      { id, name, type, status, file }
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
    await session.run('MATCH (a:Asset {id: $id}) DELETE a', { id });
  } finally {
    await session.close();
  }
};

module.exports = { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset };
