"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io("http://localhost:8080"); // connect to api-gateway WebSocket

    socket.onAny((event: string, payload: any) => {
      console.log(`📡 Received: ${event}`, payload);

      if (
        ["productCreated", "productUpdated", "productDeleted"].includes(event)
      ) {
        // 🔥 Tell React Query to refetch
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
