import express from "express";

import {
     createMaintenance,
     getAllMaintenance,
     getMaintenanceById,
     updateMaintenance,
     deleteMaintenance,
     } from "./maintenance.controller.js";
import { validateCreateMaintenance } from "./maintenance.validator.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizeRoles("Admin"),
  validateCreateMaintenance,
  createMaintenance
);
router.get(
    "/",
    authenticateUser,
    getAllMaintenance
);
router.get(
    "/:id",
    authenticateUser,
    getMaintenanceById
);
router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("Admin"),
    updateMaintenance
);
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("Admin"),
    deleteMaintenance
);

export default router;