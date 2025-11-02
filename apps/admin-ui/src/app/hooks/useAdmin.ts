// hooks/useAdmin.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAdmin = () => {
  return useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:8080/api/logged-in-admin",
        { withCredentials: true }
      );
      return data.admin;
    },
  });
};
