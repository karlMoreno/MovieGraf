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
};
