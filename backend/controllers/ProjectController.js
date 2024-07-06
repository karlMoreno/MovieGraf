const { createProject, getProjectsByUser, updateProject, deleteProject } = require('../models');

/**
 * Handles project creation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addProject = async (req, res) => {
  const { name, description } = req.body; // description not added yet 
  const { userId } = req.user; // Extract userId from the authenticated user
  try {
    const project = await createProject({ name, description }, userId);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

/**
 * Handles retrieving all projects for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProjects = async (req, res) => {
  const { userId } = req.user; // Extract userId from the authenticated user
  try {
    const projects = await getProjectsByUser(userId);
    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: error.message
    });
  }
};

/**
 * Handles updating a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const editProject = async (req, res) => {
    const { projectId } = req.params;
    const updateData = req.body;
    try {
      console.log(`Received update request for project ID: ${projectId} with data:`, updateData); // Debug log
  
      const project = await updateProject(projectId, updateData);
      if (project) {
        res.status(200).json({
          success: true,
          message: 'Project updated successfully',
          project
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
    } catch (error) {
      console.error('Error updating project:', error); // Debug log
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: error.message
      });
    }
  };
/**
 * Handles deleting a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const message = await deleteProject(projectId);
    res.status(200).json({
      success: true,
      message: message.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

module.exports = { addProject, getProjects, editProject, removeProject };
