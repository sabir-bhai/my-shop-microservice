"use client";

import { useEffect } from "react";
import { useFirebasePushNotification } from "./hooks/useFirebasePushNotification";

export default function ClientPushWrapper() {
  const {
    isSupported,
    permission,
    getFirebaseToken,
    foregroundMessage,
    clearForegroundMessage,
  } = useFirebasePushNotification();

  useEffect(() => {
    if (isSupported && permission !== "granted") {
      getFirebaseToken();
    }
  }, [isSupported, permission]);

  useEffect(() => {
    if (foregroundMessage) {
      alert(`📢 ${foregroundMessage.title || "Notification"}`);
      clearForegroundMessage();
    }
  }, [foregroundMessage]);

  return null;
}
