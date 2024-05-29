const { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset } = require('./AssetModel');
const { createUser } = require('./user');

module.exports = {
  //AssetsModel
  createAsset,
  getAssetById,
  getAllAssets,
  updateAsset,
  deleteAsset,
  //AssetsModel
  createUser,
};