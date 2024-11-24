const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Authentication Middleware
 * 
 * Verifies the JWT token provided in the `Authorization` header.
 * If the token is valid, attaches the decoded user information (e.g., userId) to the `req` object.
 * If invalid or missing, responds with a 401 or 400 error.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.error('Access denied. No Authorization header provided.');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify the token and decode user information
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure decoded payload includes userId or email
    if (!decoded.userId) {
      console.error('Invalid token payload: Missing userId.');
      return res.status(400).json({ error: 'Invalid token payload.' });
    }

    // Attach user information to the request object
    req.user = decoded;
    console.log('Authentication successful. User:', decoded);
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = auth;
