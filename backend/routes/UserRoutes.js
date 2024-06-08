const express = require("express");
const router = express.Router();
const { signUp,signIn } = require("../controllers");

router.post("/signup", signUp);
router.post("/signIn",signIn);



module.exports = router;