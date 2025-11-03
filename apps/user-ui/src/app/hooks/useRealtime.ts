"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosinstance";

export function useRealtime() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

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

      // 🔴 FORCE LOGOUT: Admin marked user as inactive/banned/deleted
      if (event === "user:force-logout" && payload?.userId === user?.id) {
        console.log(`🚨 Account ${payload.status}: ${payload.reason}`);

        // Clear all cookies and tokens
        axiosInstance.post("/api/logout").catch(() => {
          // Ignore logout errors - we're forcing logout anyway
        });

        // Clear all query cache
        queryClient.clear();

        // Redirect to login with message
        router.push(`/login?error=account_${payload.status}&message=${encodeURIComponent(payload.reason)}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, router, user?.id]);
}
