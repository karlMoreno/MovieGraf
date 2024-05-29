const express = require("express");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sessionInstance = require("./session/session");
const driver = require('./database/db.js');
const protect = require("./session/protect");
const bcrypt = require('bcrypt');

const app = express();
const port = 3002;

console.log("Starting server...");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Define the upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionInstance);

// Ensure static files from uploads are accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log every request to the server:
app.use((req, res, next) => {
  console.log(`Received request on ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

const mainRouter = require('./routes/index.js');
const assetRoutes = require('./routes/AssetRoutes.js');
const taskRoutes = require('./routes/TaskRoutes.js');

app.use('/api', mainRouter);
app.post('/api/assets-create', upload.single('file'), assetRoutes);
app.put('/api/assets-update/:id', upload.single('file'), assetRoutes);
app.use('/api', assetRoutes);

app.post('/api/tasks-create', upload.single('thumbnail'), taskRoutes);
app.put('/api/tasks-update/:id', upload.single('thumbnail'), taskRoutes);
app.use('/api', taskRoutes);

// Login endpoint
app.post('/login', async (req, res) => {
  console.log("Login attempt.");
  const { email, password } = req.body;
  const result = await session.run(
    'MATCH (u:User {email: $email}) RETURN u.password',
    { email }
  );
  if (result.records.length === 0) {
    res.status(404).json({ error: 'User not found' });
  } else {
    const hashedPassword = result.records[0].get('u.password');
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
