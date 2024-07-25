const express = require('express');
const { createSceneHandler, getSceneByIdHandler, getAllScenesHandler, updateSceneHandler, deleteSceneHandler } = require('../controllers/SceneController');

const router = express.Router();

router.post('/scenes-create', createSceneHandler);
router.get('/scenes-get/:id', getSceneByIdHandler);
router.get('/projects/:projectId/scenes-get-all', getAllScenesHandler);
router.put('/scenes-update/:id', updateSceneHandler);
router.delete('/scenes-delete/:id', deleteSceneHandler);

module.exports = router;
