const express = require("express");
const { protect } = require("../controllers/authController");
const { addProject, getAll, projectAttachment, updateProject, filterProjects } = require("../controllers/projectsController");

const router = express.Router();

router.post("/addProject", protect, projectAttachment, addProject);
router.post("/updateProject", protect, projectAttachment, updateProject);
router.get("/getAll", getAll);
router.get("/filterProjects", filterProjects);

module.exports = router;