"use client";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";
import { setLoggedIn, setUser } from "../store/slices/authSlice";
import axiosInstance from "../utils/axiosinstance";
import { isProtected } from "../utils/protected";

// Define the User type
type User = {
  phone: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

// API request to get the logged-in user
const fetchUser = async (isLoggedIn: boolean): Promise<User> => {
  const config = isLoggedIn ? isProtected : {};
  const response = await axiosInstance.get("/api/logged-in-user", config);

  return response.data.user;
};

const useUser = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const {
    data: user,
    isPending: isLoading,
    isError,
    refetch,
  } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => fetchUser(isLoggedIn),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Handle success and error cases with useEffect
  useEffect(() => {
    if (user) {
      dispatch(setLoggedIn(true));
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(setLoggedIn(false));
      dispatch(setUser(null));
    }
  }, [isError, dispatch]);

  return {
    user,
    isLoading,
    isError,
    refetch,
  };
};

export default useUser;
