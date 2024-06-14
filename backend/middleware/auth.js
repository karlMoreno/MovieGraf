
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

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("Authorization Header:", authHeader);
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    const token = authHeader.replace('Bearer ', '');
    console.log("Token received:", token);
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token decoded:", decoded);
      req.user = decoded; // Attach the decoded user information to the request object
      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(400).json({ error: 'Invalid token.' });
    }
  };

module.exports = auth;