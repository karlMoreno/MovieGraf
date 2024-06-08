const { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset } = require('./AssetModel');
const { createUser,signInUser } = require('./UserModel');
const { createTask, getTaskById, getAllTasks, updateTask, deleteTask } = require('./TaskModel')

module.exports = {
  //UserModel
  createUser,
  signInUser,
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