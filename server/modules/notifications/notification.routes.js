import express from "express";

import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "./notification.controller.js";

import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();


// =========================================
// GET ALL USER NOTIFICATIONS
// GET /api/notifications
// =========================================

router.get(
    "/",
    authenticateUser,
    getNotifications
);


// =========================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread-count
// =========================================

router.get(
    "/unread-count",
    authenticateUser,
    getUnreadCount
);


// =========================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:notificationId/read
// =========================================

router.patch(
    "/:notificationId/read",
    authenticateUser,
    markAsRead
);


// =========================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// =========================================

router.patch(
    "/read-all",
    authenticateUser,
    markAllAsRead
);

export default router;