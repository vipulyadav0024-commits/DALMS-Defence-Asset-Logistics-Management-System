import { useEffect, useState } from "react";
import axios from "axios";
import {
    Bell,
    Check,
    CheckCheck,
} from "lucide-react";

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    // =========================================
    // GET NOTIFICATIONS
    // =========================================

    const fetchNotifications = async () => {
        if (!token) return;

        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:5000/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications(
                response.data.data || []
            );
        } catch (error) {
            console.error(
                "Fetch Notifications Error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };


    // =========================================
    // GET UNREAD COUNT
    // =========================================

    const fetchUnreadCount = async () => {
        if (!token) return;

        try {
            const response = await axios.get(
                "http://localhost:5000/api/notifications/unread-count",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUnreadCount(
                response.data.data?.count || 0
            );
        } catch (error) {
            console.error(
                "Fetch Unread Count Error:",
                error
            );
        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);


    // =========================================
    // MARK ONE AS READ
    // =========================================

    const handleMarkAsRead = async (
        notificationId
    ) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id ===
                    notificationId
                        ? {
                              ...notification,
                              isRead: true,
                          }
                        : notification
                )
            );

            setUnreadCount((previous) =>
                Math.max(previous - 1, 0)
            );
        } catch (error) {
            console.error(
                "Mark Notification Read Error:",
                error
            );
        }
    };


    // =========================================
    // MARK ALL AS READ
    // =========================================

    const handleMarkAllAsRead = async () => {
        try {
            await axios.patch(
                "http://localhost:5000/api/notifications/read-all",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Mark All Notifications Error:",
                error
            );
        }
    };


    // =========================================
    // TOGGLE DROPDOWN
    // =========================================

    const handleToggle = () => {
        setOpen((previous) => !previous);

        if (!open) {
            fetchNotifications();
            fetchUnreadCount();
        }
    };


    return (
        <div className="notification-container">

            {/* Bell Button */}
            <button
                className="icon-button notification-button"
                title="Notifications"
                onClick={handleToggle}
            >
                <Bell size={20} />

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>


            {/* Notification Dropdown */}
            {open && (
                <div className="notification-dropdown">

                    {/* Header */}
                    <div className="notification-header">

                        <div>
                            <h3>
                                Notifications
                            </h3>

                            <span>
                                {unreadCount} unread
                            </span>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                className="mark-all-button"
                                onClick={
                                    handleMarkAllAsRead
                                }
                            >
                                <CheckCheck
                                    size={16}
                                />

                                Mark all
                            </button>
                        )}

                    </div>


                    {/* Notification List */}
                    <div className="notification-list">

                        {loading ? (
                            <div className="notification-empty">
                                Loading notifications...
                            </div>
                        ) : notifications.length ===
                          0 ? (
                            <div className="notification-empty">
                                <Bell size={28} />

                                <p>
                                    No notifications
                                </p>

                                <span>
                                    You're all caught up.
                                </span>
                            </div>
                        ) : (
                            notifications.map(
                                (notification) => (
                                    <div
                                        key={
                                            notification._id
                                        }
                                        className={`notification-item ${
                                            notification.isRead
                                                ? "read"
                                                : "unread"
                                        }`}
                                    >

                                        <div className="notification-icon">
                                            <Bell
                                                size={17}
                                            />
                                        </div>

                                        <div className="notification-content">

                                            <strong>
                                                {
                                                    notification.title
                                                }
                                            </strong>

                                            <p>
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            <small>
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </small>

                                        </div>

                                        {!notification.isRead && (
                                            <button
                                                className="notification-read-button"
                                                title="Mark as read"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification._id
                                                    )
                                                }
                                            >
                                                <Check
                                                    size={15}
                                                />
                                            </button>
                                        )}

                                    </div>
                                )
                            )
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};

export default NotificationDropdown;