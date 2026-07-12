const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved in a root 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Rename file to prevent naming collisions: vehicleId-timestamp.ext
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
module.exports = upload;