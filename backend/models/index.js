const { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset } = require('./AssetModel');
const { createUser } = require('./user');
const { createTask, getTaskById, getAllTasks, updateTask, deleteTask } = require('./TaskModel')

module.exports = {
  //UserModel
  createUser,
  //UserModel
  //AssetsModel
  createAsset,
  getAssetById,
  getAllAssets,
  updateAsset,
  deleteAsset,
  //AssetsModel
  //tasks models
  createTask, 
  getTaskById, 
  getAllTasks, 
  updateTask, 
  deleteTask
  // task model
};