const express = require('express');
const router = express.Router();

const userRoutes = require('./UserRoutes'); 
const assetRoutes = require('./AssetRoutes'); 
const taskRoutes = require('./TaskRoutes'); 
const projectRoutes = require('./ProjectRoutes');
const sceneRoutes = require('./SceneRoutes');
const graphRoutes = require('./GraphRoutes');

// User routes
router.use('/user', userRoutes);

// Task routes
router.use('/tasks', taskRoutes);

// Asset routes
router.use('/assets', assetRoutes);

//Project routes
router.use('/projects', projectRoutes);

//Scene routes
router.use('/scenes', sceneRoutes);

//Graph route
router.use('/graph', graphRoutes);


module.exports = router;
