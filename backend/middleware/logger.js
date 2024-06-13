/**
 * Logger Middleware
 * 
 * This middleware logs the details of incoming requests to the server.
 * It logs the HTTP method, request path, headers, and body in a readable format.
 * This is useful for debugging and monitoring the activity on the server.
 * 
 * How it works:
 * - Logs the HTTP method and path of the incoming request.
 * - Logs the request headers in a formatted JSON string.
 * - Logs the request body in a formatted JSON string.
 * - Passes control to the next middleware or route handler using the `next()` function.
 * 
 * Usage:
 * - This middleware should be used early in the middleware chain to capture details of all incoming requests.
 * - Place it before route handlers and other middleware that you want to log.
 * 
 * Example:
 * app.use(logger);
 * 
 * Author: Karl Moreno
 */

const logger = (req, res, next) => {
    console.log(`Received request on ${req.method} ${req.path}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    next(); // Pass the request to the next middleware/handler
  };
  
  module.exports = logger;
  