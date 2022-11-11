const express = require("express");
const { addUser, signin } = require("../controllers/authController");

const router = express.Router();

router.post("/addUser", addUser);
router.post("/signin", signin);





//testing
module.exports = router;