import express from "express";

import { createInventory,
    getAllInventory,
    returnInventory
 } from "./inventory.controller.js";
import { validateCreateInventory } from "./inventory.validator.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    authorizeRoles("Admin"),
    validateCreateInventory,
    createInventory
);
router.get(
    "/",
    authenticateUser,
    authorizeRoles("Admin"),
    getAllInventory
);
router.put(
    "/:id/return",
    authenticateUser,
    authorizeRoles("Admin"),
    returnInventory
);
export default router;