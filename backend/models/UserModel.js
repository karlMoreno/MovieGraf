/**
 * User Model
 * 
 * This file defines the User model with properties such as firstName, lastName, email, and password.
 * The password is hashed before being saved to the database.
 * 
 * Author: Karl Moreno
 */

const driver = require('../database/db');
const bcrypt = require('bcrypt')




const createUser = async ({firstName, lastName, email, password}) => {
    const session = driver.session({database:"neo4j"});
    const hashedPassword = await bcrypt.hash(password,10);
    try {
        const result = await session.run(
            //it is not possible to replace u dynamically with say the first name of the user you are trying to create
            'CREATE (u:User {firstName: $firstName, lastName: $lastName, email: $email,password: $hashedPassword}) RETURN u',
            { firstName, lastName, email, hashedPassword}
        );
        const user = result.records[0]?.get('u').properties;
        return user;
    } finally {
        await session.close();
    }
    
};

module.exports = { createUser };