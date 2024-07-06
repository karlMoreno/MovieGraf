const express = require('express');
const { createSceneHandler, getSceneByIdHandler, getAllScenesHandler, updateSceneHandler, deleteSceneHandler } = require('../controllers/SceneController');

const router = express.Router();

router.post('/scenes', createSceneHandler);
router.get('/scenes/:id', getSceneByIdHandler);
router.get('/projects/:projectId/scenes', getAllScenesHandler);
router.put('/scenes/:id', updateSceneHandler);
router.delete('/scenes/:id', deleteSceneHandler);

module.exports = router;
