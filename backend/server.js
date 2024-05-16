const express = require("express");
const app = express();
const port = 3002;
const cors = require('cors');
const mainRouter = require('./routes/index.js'); 
const driver = require('./database/db.js');
const protect = require("./session/protect");
const sessionInstance = require("./session/session");
const session = driver.session();
const bcrypt = require('bcrypt')

console.log("Starting server...");



app.use(cors()); 
app.use(express.json());
app.use(sessionInstance);
// Log every request to the server:
app.use((req, res, next) => {
  console.log(`Received request on ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
app.use('/api', mainRouter); 



// Login endpoint
app.post('/login', async (req, res) => {

  console.log("Login attempt.");
  const { email, password } = req.body;
  const result = await session.run(
    'MATCH (u:User {email: $email}) RETURN u.password',
    { email }
  );
  if (result.records.length === 0) {
    throw new Error('User not found');
  }
  else{

    const hashedPassword = result.records[0].get('u.password');

    console.log(password);
    console.log(hashedPassword);
    
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
        req.session.email = email; // Save user id to the session
    res.json({ success: true, message: 'Logged in successfully' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  }
});

app.get('/graph', async (req, res) => {
  try {
    const result = await session.run('MATCH (n)-[r]->(m) RETURN n, r, m');
    console.log(result);
    const nodes = new Set();
    const edges = [];
    result.records.forEach(record => {
      nodes.add(record.get('n'));
      nodes.add(record.get('m'));
      edges.push(record.get('r'));
    });
    res.json({ nodes: Array.from(nodes), edges });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// const dashRouter = require("./routes/dashboard");

// // protected
// app.use("/dashboard", protect, dashRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;

