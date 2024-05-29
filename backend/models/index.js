const { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset } = require('./AssetModel');
const { createUser } = require('./user');
const { createTask, getTaskById, getAllTasks, updateTask, deleteTask } = require('./TaskModel')

module.exports = {
  //AssetsModel
  createAsset,
  getAssetById,
  getAllAssets,
  updateAsset,
  deleteAsset,
  //AssetsModel
  createUser,
  //tasks models
  createTask, 
  getTaskById, 
  getAllTasks, 
  updateTask, 
  deleteTask
  // task model
};