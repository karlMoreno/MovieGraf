const express = require('express');
const router = express.Router();

const userRoutes = require('./UserRoutes'); // Correct capitalization
const assetRoutes = require('./AssetRoutes'); // Correct capitalization
const taskRoutes = require('./TaskRoutes'); // Correct capitalization

// User routes
router.use('/user', userRoutes);

// Task routes
router.use('/tasks', taskRoutes);

// Asset routes
router.use('/assets', assetRoutes);

module.exports = router;
