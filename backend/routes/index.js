const express = require('express');
const router = express.Router();

const userRoutes = require('./UserRoutes'); 
const assetRoutes = require('./AssetRoutes'); 
const taskRoutes = require('./TaskRoutes'); 
const projectRoutes = require('./ProjectRoutes');

// User routes
router.use('/user', userRoutes);

// Task routes
router.use('/tasks', taskRoutes);

// Asset routes
router.use('/assets', assetRoutes);

//Project routes
router.use('/projects', projectRoutes);

module.exports = router;
