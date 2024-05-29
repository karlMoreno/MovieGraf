const express = require('express');
const {
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
} = require('../controllers/AssetController');

const router = express.Router();

router.post('/assets-create', createAssetHandler);
router.get('/assets-get/:id', getAssetByIdHandler);
router.get('/assets-get-all', getAllAssetsHandler);
router.put('/assets-update/:id', updateAssetHandler);
router.delete('/assets-delete/:id', deleteAssetHandler);

module.exports = router;
