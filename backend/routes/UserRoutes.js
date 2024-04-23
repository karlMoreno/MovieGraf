const express = require("express");
const router = express.Router();
const { signUp } = require("../controllers");

router.post("/signup/user-create", (req, res, next) => {
    console.log("Inside signup route handler");
    next();
}, signUp);

module.exports = router;