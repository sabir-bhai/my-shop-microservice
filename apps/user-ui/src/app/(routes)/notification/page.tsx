"use client";
import React, { useState } from "react";
import {
  Bell,
  X,
  Package,
  ShoppingBag,
  Heart,
  Star,
  Gift,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Types
interface Notification {
  id: string;
  type: "order" | "wishlist" | "promotion" | "shipping" | "review" | "general";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
}

type NotificationFilter = "ALL" | "UNREAD" | "READ";

// Dummy data
const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Confirmed",
    message: "Your order #12345 has been confirmed and is being processed.",
    time: "2 minutes ago",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    type: "shipping",
    title: "Package Shipped",
    message:
      "Your package has been shipped and will arrive in 2-3 business days.",
    time: "1 hour ago",
    isRead: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "promotion",
    title: "Flash Sale Alert!",
    message: "Get 50% off on electronics. Limited time offer ends today!",
    time: "3 hours ago",
    isRead: true,
    priority: "high",
  },
  {
    id: "4",
    type: "wishlist",
    title: "Price Drop Alert",
    message: "An item in your wishlist is now 30% cheaper!",
    time: "5 hours ago",
    isRead: false,
    priority: "medium",
  },
  {
    id: "5",
    type: "review",
    title: "Review Request",
    message: "How was your recent purchase? Leave a review and earn points.",
    time: "1 day ago",
    isRead: true,
    priority: "low",
  },
  {
    id: "6",
    type: "shipping",
    title: "Out for Delivery",
    message: "Your package is out for delivery and will arrive today.",
    time: "2 days ago",
    isRead: false,
    priority: "high",
  },
  {
    id: "7",
    type: "general",
    title: "Account Security",
    message: "Your account was accessed from a new device. Was this you?",
    time: "3 days ago",
    isRead: true,
    priority: "high",
  },
  {
    id: "8",
    type: "promotion",
    title: "New Collection Launch",
    message: "Check out our latest summer collection with amazing deals!",
    time: "1 week ago",
    isRead: true,
    priority: "low",
  },
];

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("ALL");

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (activeFilter) {
      case "UNREAD":
        return !notification.isRead;
      case "READ":
        return notification.isRead;
      default:
        return true;
    }
  });

  // Get icon for notification type
  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `w-5 h-5 ${
      priority === "high"
        ? "text-red-500"
        : priority === "medium"
        ? "text-orange-500"
        : "text-gray-500"
    }`;

    switch (type) {
      case "order":
        return <Package className={iconClass} />;
      case "shipping":
        return <Truck className={iconClass} />;
      case "wishlist":
        return <Heart className={iconClass} />;
      case "promotion":
        return <Gift className={iconClass} />;
      case "review":
        return <Star className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-500 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#773d4c] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="text-sm opacity-90">{unreadCount} unread</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex">
            {(["ALL", "UNREAD", "READ"] as NotificationFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 relative ${
                    activeFilter === filter
                      ? "text-[#773d4c] bg-white border-b-2 border-[#773d4c]"
                      : "text-gray-600 hover:text-[#773d4c] hover:bg-gray-100"
                  }`}
                >
                  {filter}
                  {filter === "UNREAD" && unreadCount > 0 && (
                    <span className="ml-2 bg-[#773d4c] text-white text-xs rounded-full px-2 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                  {filter === "READ" && readCount > 0 && (
                    <span className="ml-2 bg-gray-400 text-white text-xs rounded-full px-2 py-0.5">
                      {readCount}
                    </span>
                  )}
                  {filter === "ALL" && notifications.length > 0 && (
                    <span className="ml-2 bg-gray-600 text-white text-xs rounded-full px-2 py-0.5">
                      {notifications.length}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 px-3 py-1 bg-[#773d4c] text-white text-xs font-medium rounded-full hover:bg-[#6a3543] transition-colors duration-200"
              >
                <CheckCircle className="w-3 h-3" />
                Mark All Read
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 text-sm">
                {activeFilter === "UNREAD"
                  ? "You're all caught up! No unread notifications."
                  : activeFilter === "READ"
                  ? "No read notifications yet."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(
                        notification.type,
                        notification.priority
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold text-gray-900 ${
                            !notification.isRead ? "text-[#773d4c]" : ""
                          }`}
                        >
                          {notification.title}
                        </h4>

                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#773d4c] rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {notification.priority === "high" && (
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Notification Bell Component for Header
interface NotificationBellProps {
  onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onClick,
}) => {
  const unreadCount = dummyNotifications.filter((n) => !n.isRead).length;

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-[#773d4c] transition-colors duration-200 rounded-full hover:bg-gray-100"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <>
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 bg-[#773d4c] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
          {/* Pulse Animation */}
          <span className="absolute -top-1 -right-1 bg-[#773d4c] rounded-full w-5 h-5 animate-ping opacity-20"></span>
        </>
      )}
    </button>
  );
};

// Main Component for Usage in Header
export const NotificationSystem: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <NotificationBell onClick={() => setIsSidebarOpen(true)} />
      <NotificationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default NotificationSidebar;
