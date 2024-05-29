const {signUp} = require("./UserController");
const {  createAssetHandler, getAssetByIdHandler, getAllAssetsHandler, updateAssetHandler, deleteAssetHandler,} = require("./AssetController")

module.exports = {
  signUp,
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
};
