const {createUser} = require('../models')

const signUp = async (req,res) => {
    const {firstName, lastName, email, password} = req.body;
    try {
        const user = await createUser({firstName, lastName,email,password});
        res.status(201).json({
            sucess:true,
            message: "User has been sucessfully created",
            data: user
        });
    } catch (error) {
        console.error("Error in signUp", error);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        })
    }
}

module.exports = {signUp};