"use client";

import { Search, Heart, ShoppingCart, User, Bell } from "lucide-react";

import { useAppSelector, useAppDispatch } from "../../../store/hook";
// import { toggleCart } from "../../../store/slices/cartSlice";
import { RootState } from "../../../store";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import NotificationSidebar, {
  NotificationBell,
} from "../../../(routes)/notification/page";
import BottomMenuBar from "./BottomMenuBar";
import SearchBar from "./SearchBar";
import useUser from "../../../hooks/useUser";
import { toggleCart } from "../../../store/slices/cartSlice";
import { useSelector } from "react-redux";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const selectCartItems = useSelector((state: RootState) => state.cart.items);
  console.log("Header rendered", selectCartItems.length);
  const { user, isLoading, isError, refetch } = useUser();

  return (
    <>
      <header className="bg-[#ffffff] text-[#191817] shadow-md sticky top-0 z-50">
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="cursor-pointer">
              <span className="text-2xl font-bold text-purple-600 hover:text-purple-800">
                MyShop
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Icons */}
          <div className="flex items-center gap-6">
            <button className="hover:text-purple-600 transition-colors">
              <Link href="/wishlist">
                <Heart className="w-6 h-6" />
              </Link>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="hover:text-purple-600 transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {selectCartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full px-1.5">
                  {selectCartItems.length}
                </span>
              )}
            </button>

            <div>
              <NotificationBell onClick={() => setIsSidebarOpen(true)} />
              <NotificationSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
            <button>
              <Link href="/profile">
                {user && user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32} // 👈 required
                    height={32} // 👈 required
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </Link>
            </button>
          </div>
        </div>

        {/* Bottom Menu Bar */}
        <BottomMenuBar />
      </header>
    </>
  );
}
