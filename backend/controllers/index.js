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
};
