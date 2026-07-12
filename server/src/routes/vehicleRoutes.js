const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");
const upload = require("../middleware/upload");
// All endpoints in this file require valid authentication[cite: 1]
router.use(protect);

// Unified routing mapping
router
  .route("/")
  .get(getAllVehicles) // Anyone authenticated can view assets[cite: 1]
  .post(authorizeRoles("Fleet Manager"), createVehicle); // Only Fleet Managers can register assets[cite: 1]

router.post(
  "/:id/documents",
  authorizeRoles("Fleet Manager"),
  upload.single("document"), // Expects a file field named 'document'[cite: 1]
  async (req, res) => {
    // Here, you would typically save req.file.path to a 'documents' array in your Vehicle model
    res.json({
      message: "Document uploaded successfully",
      filePath: req.file.path,
    });
  },
);

router
  .route("/:id")
  .get(getVehicleById)
  .put(authorizeRoles("Fleet Manager"), updateVehicle)
  .delete(authorizeRoles("Fleet Manager"), deleteVehicle);

module.exports = router;
