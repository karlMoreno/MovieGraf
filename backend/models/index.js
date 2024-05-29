const { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset } = require('./AssetModel');
const { createUser } = require('./user');

module.exports = {
  createAsset,
  getAssetById,
  getAllAssets,
  updateAsset,
  deleteAsset,
  createUser,
};