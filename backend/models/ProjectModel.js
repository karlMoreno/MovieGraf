const driver = require('../database/db');

/**
 * Creates a new project
 * @param {Object} projectDetails - The details of the project to create
 * @param {string} userId - The ID of the user who owns the project
 * @returns {Object} - The created project
 */
const createProject = async (projectDetails, userId) => {
  const session = driver.session({ database: 'neo4j' });
  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $userId})
      CREATE (p:Project {name: $name, userId: $userId})
      CREATE (u)-[:OWNS]->(p)
      RETURN p
      `,
      { ...projectDetails, userId }
    );
    const project = result.records[0].get('p').properties;
    return project;
  } finally {
    await session.close();
  }
};


/**
 * Retrieves all projects for a user
 * @param {string} userId - The ID of the user whose projects to retrieve
 * @returns {Array} - List of projects
 */
const getProjectsByUser = async (userId) => {
    const session = driver.session({ database: 'neo4j' });
    try {
      const result = await session.run(
        'MATCH (p:Project {userId: $userId}) RETURN p',
        { userId }
      );
      return result.records.map(record => record.get('p').properties);
    } finally {
      await session.close();
    }
  };
  
  /**
 * Updates a project
 * @param {string} projectId - The ID of the project to update
 * @param {Object} updateData - The data to update in the project
 * @returns {Object} - The updated project
 */
const updateProject = async (projectId, updateData) => {
    const session = driver.session({ database: 'neo4j' });
    try {
      console.log(`Updating project with ID: ${projectId} with data:`, updateData); // Debug log
  
      // Ensure updateData is correctly parsed
      const { name } = updateData;
      if (!name) {
        throw new Error('Expected parameter(s): name');
      }
  
      const result = await session.run(
        'MATCH (p:Project) WHERE ID(p) = $projectId SET p.name = $name RETURN p',
        { projectId: parseInt(projectId), name }
      );
  
      const project = result.records[0]?.get('p').properties;
      return project;
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    } finally {
      await session.close();
    }
  };
  
  /**
   * Deletes a project
   * @param {string} projectId - The ID of the project to delete
   * @returns {Object} - The deleted project
   */
  const deleteProject = async (projectId) => {
    const session = driver.session({ database: 'neo4j' });
    try {
      await session.run(
        'MATCH (p:Project) WHERE ID(p) = $projectId DELETE p',
        { projectId: parseInt(projectId) }
      );
      return { message: 'Project deleted successfully' };
    } finally {
      await session.close();
    }
  };
  
  module.exports = { createProject, getProjectsByUser, updateProject, deleteProject };