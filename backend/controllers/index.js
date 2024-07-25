const { 
  signUp,
  signIn
 } = require("./UserController");
const {
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
} = require("./AssetController");
const {
  createTaskHandler,
  getTaskByIdHandler,
  getAllTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
} = require("./TaskController");

const {addProject, getProjects, editProject, removeProject} = require("./ProjectController")

const { createSceneHandler, getSceneByIdHandler, getAllScenesHandler, updateSceneHandler, deleteSceneHandler } = require("./SceneController");

const {fetchGraph} = require('./GraphController');

module.exports = {
  //UserController
  signUp,
  signIn,
  //UserController
  //AssetController
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
  //AssetController
  //TaskController
  createTaskHandler,
  getTaskByIdHandler,
  getAllTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
  //TaskController
  //Project Controller
  addProject,
  getProjects,
  editProject,
  removeProject,
  //Project Controller
  //Scene Controller
  createSceneHandler, 
  getSceneByIdHandler,
  getAllScenesHandler, 
  updateSceneHandler, 
  deleteSceneHandler,
  //Scene Controller
  //Graph Controller
  fetchGraph,
  //Graph Controller
};
