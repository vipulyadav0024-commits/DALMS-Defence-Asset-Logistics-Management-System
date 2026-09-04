import Notification from "./notification.model.js";

/*
 * Create a new notification
 */
export const createNotification = async ({
    title,
    message,
    type = "info",
    userId,
}) => {
    const notification = await Notification.create({
        title,
        message,
        type,
        userId,
    });

    return notification;
};


/*
 * Get notifications for a specific user
 */
export const getUserNotifications = async (userId) => {
    const notifications = await Notification.find({
        userId,
    })
        .sort({ createdAt: -1 })
        .limit(20);

    return notifications;
};


/*
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (
    userId
) => {
    const count = await Notification.countDocuments({
        userId,
        isRead: false,
    });

    return count;
};


/*
 * Mark one notification as read
 */
export const markNotificationAsRead = async (
    notificationId,
    userId
) => {
    const notification =
        await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                userId,
            },
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

    return notification;
};


/*
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (
    userId
) => {
    await Notification.updateMany(
        {
            userId,
            isRead: false,
        },
        {
            isRead: true,
        }
    );

    return true;
};