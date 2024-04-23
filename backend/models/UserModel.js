
const driver = require("../server");
const bcrypt = require('bcrypt')


const createUser = async ({firstName, lastName, email, password}) => {
    const session = driver.session({database:"neo4j"});
    const hashedPassword = await bcrypt.hash(password,10);
    try {
        const result = await session.run(
            'CREATE (u:User {firstName: $firstName, lastName: $lastName, email: $email,password: $hashedPassword}) RETURN u',
            { firstName, lastName, email, password: hashedPassword}
        );
        const user = result.records[0]?.get('u').properties;
        return user;
    } finally {
        await session.close();
    }
    
};

module.exports = { createUser };