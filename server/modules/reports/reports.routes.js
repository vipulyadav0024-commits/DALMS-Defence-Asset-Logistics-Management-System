import express from "express";

import { getReports } from "./reports.controller.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get(
    "/",
    authenticateUser,
    authorizeRoles("Admin"),
    getReports
);

export default router;