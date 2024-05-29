const express = require('express');
const {
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
} = require('../controllers/AssetController');

const router = express.Router();

router.post('/assets', createAssetHandler);
router.get('/assets/:id', getAssetByIdHandler);
router.get('/assets', getAllAssetsHandler);
router.put('/assets/:id', updateAssetHandler);
router.delete('/assets/:id', deleteAssetHandler);

module.exports = router;
