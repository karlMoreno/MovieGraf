const { createAsset, getAssetById, getAllAssets, updateAsset, deleteAsset } = require('../models/AssetModel');

const createAssetHandler = async (req, res) => {
  const assetData = req.body;
  try {
    const asset = await createAsset(assetData);
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAssetByIdHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await getAssetById(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAssetsHandler = async (req, res) => {
  try {
    const assets = await getAllAssets();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAssetHandler = async (req, res) => {
  const { id } = req.params;
  const assetData = req.body;
  try {
    const asset = await updateAsset(id, assetData);
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAssetHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAsset(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAssetHandler,
  getAssetByIdHandler,
  getAllAssetsHandler,
  updateAssetHandler,
  deleteAssetHandler,
};
