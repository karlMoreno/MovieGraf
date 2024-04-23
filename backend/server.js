const express = require("express");
const app = express();
const port = 3002;
const cors = require('cors');
const mainRouter = require('./routes/index'); 


console.log("Starting server...");



app.use(cors()); 
app.use(express.json());
// Log every request to the server:
app.use((req, res, next) => {
  console.log(`Received request on ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
app.use('/api', mainRouter); 



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

