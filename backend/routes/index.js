// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./UserRoutes');
// const productRoutes = require('./productRoutes'); // Additional route files // this is just an example


router.use('/users', userRoutes);
// router.use('/products', productRoutes); // Implementing more routes // this is just an example

module.exports = router;
