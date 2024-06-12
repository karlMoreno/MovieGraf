const express = require('express');
const { addProject, getProjects, editProject, removeProject } = require('../controllers');
const auth = require('../middleware/auth'); // Ensure this middleware is used for protected routes
const router = express.Router();

router.post('/add', auth, addProject); // Protected route for adding projects
router.get('/list', auth, getProjects); // Protected route for retrieving projects
router.put('/edit/:projectId', auth, editProject); // Protected route for updating a project
router.delete('/delete/:projectId', auth, removeProject); // Protected route for deleting a project

module.exports = router;
