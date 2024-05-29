const express = require('express');
const {
  createTaskHandler,
  getTaskByIdHandler,
  getAllTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
} = require('../controllers/TaskController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Define the upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/tasks-create', upload.single('thumbnail'), createTaskHandler);
router.get('/tasks-get/:id', getTaskByIdHandler);
router.get('/tasks-get-all', getAllTasksHandler);
router.put('/tasks-update/:id', upload.single('thumbnail'), updateTaskHandler);
router.delete('/tasks-delete/:id', deleteTaskHandler);

module.exports = router;
