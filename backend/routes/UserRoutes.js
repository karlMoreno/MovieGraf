/**
 * User Routes
 * 
 * This file defines the routes related to user operations such as sign-up and sign-in.
 * It maps the HTTP endpoints to the corresponding controller functions for handling user actions.
 * 
 * Routes:
 * - POST /signup: Route for user registration, handled by the signUp controller function.
 * - POST /signin: Route for user authentication, handled by the signIn controller function.
 * 
 * Imports:
 * - signUp: Controller function to handle user sign-up.
 * - signIn: Controller function to handle user sign-in.
 * 
 * Author: Karl Moreno
 */

const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers");

router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;


