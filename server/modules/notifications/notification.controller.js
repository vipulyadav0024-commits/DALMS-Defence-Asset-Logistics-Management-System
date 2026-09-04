import {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "./notification.service.js";


// =========================================
// GET USER NOTIFICATIONS
// =========================================

export const getNotifications = async (req, res) => {
    try {
        const notifications =
            await getUserNotifications(
                req.user._id
            );

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        console.error(
            "Get Notifications Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications.",
        });
    }
};


// =========================================
// GET UNREAD COUNT
// =========================================

export const getUnreadCount = async (req, res) => {
    try {
        const count =
            await getUnreadNotificationCount(
                req.user._id
            );

        res.status(200).json({
            success: true,
            data: {
                count,
            },
        });
    } catch (error) {
        console.error(
            "Get Unread Count Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch unread notification count.",
        });
    }
};


// =========================================
// MARK ONE AS READ
// =========================================

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification =
            await markNotificationAsRead(
                notificationId,
                req.user._id
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Notification marked as read.",
            data: notification,
        });
    } catch (error) {
        console.error(
            "Mark Notification Read Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update notification.",
        });
    }
};


// =========================================
// MARK ALL AS READ
// =========================================

export const markAllAsRead = async (req, res) => {
    try {
        await markAllNotificationsAsRead(
            req.user._id
        );

        res.status(200).json({
            success: true,
            message:
                "All notifications marked as read.",
        });
    } catch (error) {
        console.error(
            "Mark All Notifications Read Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update notifications.",
        });
    }
};