const { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset } = require('./AssetModel');
const { createUser,signInUser } = require('./UserModel');
const { createTask, getTaskById, getAllTasks, updateTask, deleteTask } = require('./TaskModel')
const { createProject, getProjectsByUser, updateProject, deleteProject } = require('./ProjectModel')
const { createScene, getSceneById, getAllScenes, updateScene, deleteScene } = require('./SceneModel');
const {getGraph} = require('./GraphModel');

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
  deleteTask,
  // task model
  //Project Model
  createProject,
  getProjectsByUser,
  updateProject,
  deleteProject,
  // Project Model
  //Scene Model
  createScene, 
  getSceneById, 
  getAllScenes, 
  updateScene, 
  deleteScene,
  //Scene Model
  //Graph Model
  getGraph,
  //Graph Model
};