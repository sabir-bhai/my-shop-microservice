// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCrKapN6-halG7ZjkP3atyzJPZozPbnYBc",
  authDomain: "eshop-a453d.firebaseapp.com",
  projectId: "eshop-a453d",
  storageBucket: "eshop-a453d.firebasestorage.app",
  messagingSenderId: "828065721264",
  appId: "1:828065721264:web:2873a39eff14287917c475",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/firebase-logo.png",
    badge: "/badge-72x72.png",
    tag: payload.data?.tag || "default",
    data: payload.data,
    actions: payload.data?.actions ? JSON.parse(payload.data.actions) : [],
    requireInteraction: payload.data?.requireInteraction === "true",
    silent: payload.data?.silent === "true",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked:", event);

  event.notification.close();

  // Handle action clicks
  if (event.action) {
    console.log("Action clicked:", event.action);

    // Handle different actions
    switch (event.action) {
      case "open":
        event.waitUntil(clients.openWindow("/"));
        break;
      case "dismiss":
        // Just close the notification
        break;
      default:
        event.waitUntil(clients.openWindow("/"));
    }
    return;
  }

  // Default click action - focus or open the app
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        // If there's already a window open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }

        // If no window is open, open a new one
        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.url || "/";
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle notification close
self.addEventListener("notificationclose", function (event) {
  console.log("Notification closed:", event);

  // Track notification close event
  if (event.notification.data?.trackClose) {
    // Send analytics event
    fetch("/api/analytics/notification-close", {
      method: "POST",
      body: JSON.stringify({
        notificationId: event.notification.data.id,
        timestamp: Date.now(),
      }),
    });
  }
});
