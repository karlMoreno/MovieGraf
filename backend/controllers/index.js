const {signUp} = require("./UserController");
const { createAssetHandler, getAssetByIdHandler, getAllAssetsHandler, updateAssetHandler, deleteAssetHandler,} = require("./AssetController")
const {
  createTaskHandler,
  getTaskByIdHandler,
  getAllTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
} = require("./TaskController")

module.exports = {
  signUp,
  //AssetController
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
  //AssetController
    createTaskHandler,
    getTaskByIdHandler,
    getAllTasksHandler,
    updateTaskHandler,
    deleteTaskHandler,
  

};
