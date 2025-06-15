const express = require("express");
const templatesController = require("../controllers/templatesController");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

// Routes cho frontend (không yêu cầu xác thực)
router.get("/", templatesController.getAllTemplates);
router.get("/:id", templatesController.getTemplateById);

// Routes cho admin (yêu cầu xác thực admin)
router.get("/admin/all", isAdmin, templatesController.getAllTemplatesAdmin);
router.post("/", isAdmin, templatesController.createTemplate);
router.put("/:id", isAdmin, templatesController.updateTemplate);
router.patch("/:id/status", isAdmin, templatesController.updateTemplateStatus);
router.delete("/:id", isAdmin, templatesController.deleteTemplate);

module.exports = router; 