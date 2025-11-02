// hooks/useFirebasePushNotification.ts
import { useState, useEffect } from "react";
import { messaging } from "../config/firebase";
import { getToken, onMessage } from "firebase/messaging";
import axiosInstance from "../utils/axiosinstance";

interface FirebaseNotification {
  title?: string;
  body?: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
}

interface TokenData {
  token: string;
  userId?: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    timestamp: number;
  };
}

export const useFirebasePushNotification = () => {
  //Stores the current FCM token for this device.
  const [token, setToken] = useState<string | null>(null);
  //true if the browser supports Push API & service workers.
  const [isSupported, setIsSupported] = useState(false);
  //Stores "granted" | "denied" | "default" from Notification API.
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);
  // foregroundMessage → Holds the most recent push message received while the page is open.
  const [foregroundMessage, setForegroundMessage] =
    useState<FirebaseNotification | null>(null);

  useEffect(() => {
    // Check if push messaging is supported
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      messaging
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Register service worker
      registerServiceWorker();

      // Listen for foreground messages
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);

        const notification: FirebaseNotification = {
          title: payload.notification?.title,
          body: payload.notification?.body,
          icon: payload.notification?.icon,
          data: payload.data,
        };

        setForegroundMessage(notification);

        // Show browser notification for foreground messages
        if (Notification.permission === "granted") {
          new Notification(notification.title || "New Message", {
            body: notification.body,
            icon: notification.icon || "/firebase-logo.png",
            data: notification.data,
          });
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      console.log("Service Worker registered successfully");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.error("Push messaging is not supported");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      console.error("Permission for notifications was denied");
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    return permission === "granted";
  };

  const getFirebaseToken = async () => {
    if (!messaging || !isSupported) {
      throw new Error("Firebase messaging not supported");
    }

    setLoading(true);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error("Permission not granted for notifications");
      }

      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (!currentToken) {
        throw new Error("No registration token available");
      }

      const tokenData: TokenData = {
        token: currentToken,

        deviceInfo: {
          userAgent: navigator.userAgent,
          platform:
            ("userAgentData" in navigator &&
              (navigator as any).userAgentData?.platform) ||
            "unknown",
          timestamp: Date.now(),
        },
      };
      console.log("Notification token data", tokenData);
      // Save token to server
      // const response = await fetch("/api/firebase/subscribe", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(tokenData),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to save token to server");
      // }
      const response = await axiosInstance.post("/api/device-token", tokenData);
      setToken(currentToken);
      console.log("Firebase token obtained and saved:", currentToken);
      return currentToken;
    } catch (error) {
      console.error("Error getting Firebase token:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!token) return;

    setLoading(true);

    try {
      // Remove token from server
      await fetch("/api/firebase/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      setToken(null);
      console.log("Successfully unsubscribed");
    } catch (error) {
      console.error("Error unsubscribing:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearForegroundMessage = () => {
    setForegroundMessage(null);
  };

  return {
    isSupported,
    permission,
    token,
    loading,
    foregroundMessage,
    getFirebaseToken,
    unsubscribe,
    clearForegroundMessage,
  };
};
