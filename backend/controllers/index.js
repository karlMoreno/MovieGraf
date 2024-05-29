const {signUp} = require("./UserController");
const { createAssetHandler, getAssetByIdHandler, getAllAssetsHandler, updateAssetHandler, deleteAssetHandler,} = require("./AssetController")

module.exports = {
  signUp,
  //AssetController
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
  //AssetController

};
