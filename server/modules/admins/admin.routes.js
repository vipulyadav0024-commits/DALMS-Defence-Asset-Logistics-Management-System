import express from "express";

import {
    getAdmins,
    addAdmin,
} from "./admin.controller.js";

import {
     authenticateUser,
     requireAdmin,
     } from "../../middleware/auth.middleware.js";

const router = express.Router();

/*
    Admin Management Routes

    Every route below requires a valid JWT.
*/

router.get(
    "/",
    authenticateUser,
    requireAdmin,
    getAdmins
);

router.post(
    "/",
    authenticateUser,
    requireAdmin,
    addAdmin
);

export default router;