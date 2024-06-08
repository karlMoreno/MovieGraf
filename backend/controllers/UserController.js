const {createUser, signInUser} = require('../models')




/**
 * Handles user sign-up
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const signUp = async (req,res) => {
    const {firstName, lastName, email, password} = req.body;
    try {
        const user = await createUser({firstName, lastName,email,password});
        console.log("User has been successfully created:", user);
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


/**
 * Handles user sign-in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const signIn = async(req,res) => {
    const {email, password} = req.body;
    try{
        const {token,userId} = await signInUser({email,password});
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token,
            userId
        });
    } catch (error){
        res.status(400).json({
            sucess: false,
            message: "Failed to sign in",
            error: error.message
        });
    }
};




module.exports = {signUp,signIn};