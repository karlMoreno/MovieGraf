
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';




/**
 * Authentication Middleware
 * 
 * This middleware function verifies the JWT token provided in the request headers.
 * If the token is valid, it attaches the decoded user information to the request object and calls the next middleware.
 * If the token is invalid or missing, it responds with an appropriate error message.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const auth = (req,res,next) =>{
    const token = req.header('Authorization')?.replace('Bearer', '');
    if(!token){
        return res.status(401).json({error: "Access denied to token provided"});
    }
    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        res.status(400).json({error: 'Invalid Token'})
    }
};

module.exports = auth;