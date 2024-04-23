const express = require("express");
const routre = express.Router();
const {signUp} = require("../controllers")

//Post endpoint for user registration
router.post("/signup/user-create",signUp);

module.exports = router;