// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require("./UserRoutes"); // This is capitalized because i kept getting errors for it idk why its probs cuz of imports on other files
// const productRoutes = require('./productRoutes'); // Additional route files // this is just an example

const assetRoutes = require("./AssetRoutes");
const taskRoutes = require("./TaskRoutes");


router.use('/', userRoutes);
// router.use('/products', productRoutes); // Implementing more routes // this is just an example
router.use('/', taskRoutes);

router.use('/',assetRoutes);
module.exports = router;
