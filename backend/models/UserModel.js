// src/models/UserModel.js



const session = require('../db/neo4jdb');  // Assuming you export a Neo4j session from this module

const UserModel = {
  createUser: async (userData) => {
    const { email, password, name } = userData;
    return await session.run(
      'CREATE (u:User {email: $email, password: $password, name: $name, createdAt: $createdAt}) RETURN u',
      { email, password, name, createdAt: new Date() }
    );
  },

  findUserByEmail: async (email) => {
    const result = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );
    return result.records[0]?.get('u').properties;
  }
};

module.exports = UserModel;
