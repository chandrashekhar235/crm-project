const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST /api/upload
// Expects multipart/form-data with a file field named "file"
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  // Construct URL
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.status(200).json({ 
    success: true, 
    message: 'File uploaded successfully', 
    url: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;
