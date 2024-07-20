const express = require('express');
const {fetchGraph} = require('../controllers')
const router = express.Router();


router.get('graph-get/:id', fetchGraph);

module.exports = router;