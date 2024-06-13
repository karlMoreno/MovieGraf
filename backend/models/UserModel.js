/**
 * User Model
 * 
 * This file defines the User model with properties such as firstName, lastName, email, and password.
 * It includes functions for creating users and signing in users.
 * The password is hashed before being saved to the database.
 * 
 * Author: Karl Moreno
 */

const driver = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Creates a new user
 * @param {Object} userDetails - The details of the user to create
 * @param {string} userDetails.firstName - The first name of the user
 * @param {string} userDetails.lastName - The last name of the user
 * @param {string} userDetails.email - The email of the user
 * @param {string} userDetails.password - The password of the user
 * @returns {Object} - The created user
 */


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



/**
 * Signs in a user
 * @param {Object} userDetails - The details of the user to sign in
 * @param {string} userDetails.email - The email of the user
 * @param {string} userDetails.password - The password of the user
 * @returns {Object} - An object containing the JWT and user ID
 */

const signInUser = async({email, password}) =>{
    const session = driver.session({database:'neo4j'});
    try {
        const result = await session.run(
            'MATCH (u:User {email:$email}) RETURN u',
            {email}
        );
        if(result.records.length === 0){
            throw new Error ("User not found");
        }
        const user = result.records[0].get('u').properties
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            throw new Error("Invalid Credentials - Wrong Password");
        }
        const token = jwt.sign({userId: user.email}, JWT_SECRET, {expiresIn: "1h"}); // 1 hour for testing purposes subject to change
        return {token, userId: user.email}
    } finally{
        await session.close();
    }
};

module.exports = { createUser, signInUser };