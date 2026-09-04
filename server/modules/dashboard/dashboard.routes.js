import express from "express";

import { getDashboardStats } from "./dashboard.controller.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get(
    "/stats",
    authenticateUser,
    getDashboardStats
);

export default router;