const express = require('express');
const router = express.Router();
const graphController = require('../controllers/GraphController');

// Route to save graph data
router.post('/save-graph', graphController.saveGraph);

router.get('/get-graph', graphController.getGraph);

router.delete('/delete-node/:nodeType/:id', graphController.deleteNode);

module.exports = router;