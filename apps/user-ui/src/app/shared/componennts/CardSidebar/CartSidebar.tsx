// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import axiosInstance from "../../../utils/axiosinstance";
// import { useAppDispatch } from "../../../store/hook";
// import {
//   CartItem,
//   closeCart,
//   decrementQuantityLocalStorage,
//   incrementQuantityLocalStorage,
//   removeFromCartLocalStorage,
// } from "../../../store/slices/cartSlice";
// import { toast } from "sonner";
// import { AxiosError } from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store";
// import useUser from "../../../hooks/useUser";

// export default function CartSidebar() {
//   const dispatch = useAppDispatch();
//   const queryClient = useQueryClient();
//   const { user } = useUser();

//   // Get Redux cart items for unauthenticated users
//   const selectCartItems = useSelector((state: RootState) => state.cart.items);

//   // Only fetch cart data if user is authenticated
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["cart"],
//     queryFn: async () => {
//       const res = await axiosInstance.get("/cart/api/get-all-cart", {
//         withCredentials: true,
//       });
//       console.log("Cart data:", res.data.data.cartItems);
//       return res.data.data;
//     },
//     enabled: !!user, // Only run query if user exists
//   });

//   // Use API data for authenticated users, Redux state for unauthenticated users
//   const cartItems = user ? data?.cartItems || [] : selectCartItems || [];

//   console.log("Cart items:", cartItems);
//   console.log("User authenticated:", !!user);

//   // Mutations for authenticated users
//   const { mutate: increaseQuantity, isPending: isIncreasing } = useMutation({
//     mutationFn: async (productId: string) => {
//       const res = await axiosInstance.patch(
//         "/cart/api/increase-to-cart",
//         { productId },
//         { withCredentials: true }
//       );
//       return res.data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["cart"] });
//       toast.success(data?.message || "Quantity increased successfully");
//     },
//     onError: (error: unknown) => {
//       const err = error as AxiosError<any>;
//       const errorMessage =
//         err?.response?.data?.message ||
//         err?.response?.data?.error?.message ||
//         err.message ||
//         "Failed to increase quantity";
//       toast.error(errorMessage);
//     },
//   });

//   const { mutate: decreaseQuantity, isPending: isDecreasing } = useMutation({
//     mutationFn: async (productId: string) => {
//       const res = await axiosInstance.patch(
//         "/cart/api/decrease-to-cart",
//         { productId },
//         { withCredentials: true }
//       );
//       return res.data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["cart"] });
//       toast.success(data?.message || "Quantity updated successfully");
//     },
//     onError: (error: unknown) => {
//       const err = error as AxiosError<any>;
//       const errorMessage =
//         err?.response?.data?.message ||
//         err?.response?.data?.error?.message ||
//         err.message ||
//         "Failed to decrease quantity";
//       toast.error(errorMessage);
//     },
//   });

//   const { mutate: removeItem, isPending: isRemoving } = useMutation({
//     mutationFn: async (productId: string) => {
//       const res = await axiosInstance.delete("/cart/api/remove-to-cart", {
//         data: { productId },
//         withCredentials: true,
//       });
//       return res.data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["cart"] });
//       toast.success(data?.message || "Item removed from cart successfully");
//     },
//     onError: (error: unknown) => {
//       const err = error as AxiosError<any>;
//       const errorMessage =
//         err?.response?.data?.message ||
//         err?.response?.data?.error?.message ||
//         err.message ||
//         "Failed to remove item from cart";
//       toast.error(errorMessage);
//     },
//   });

//   // Handle quantity increase - use appropriate method based on user auth status
//   const handleIncrease = (item: CartItem) => {
//     if (user) {
//       // For authenticated users, use productId from the item
//       const productId = item.id || item.product?.id;
//       if (productId) {
//         increaseQuantity(productId);
//       }
//     } else {
//       // For unauthenticated users, use item id for Redux
//       dispatch(incrementQuantityLocalStorage(item.id));
//     }
//   };

//   // Handle quantity decrease - use appropriate method based on user auth status
//   const handleDecrease = (item: CartItem) => {
//     if (user) {
//       // For authenticated users, use productId from the item
//       const productId = item.id || item.product?.id;
//       if (productId) {
//         decreaseQuantity(productId);
//       }
//     } else {
//       // For unauthenticated users, use item id for Redux
//       dispatch(decrementQuantityLocalStorage(item.id));
//     }
//   };

//   // Handle item removal - use appropriate method based on user auth status
//   const handleRemove = (item: CartItem) => {
//     if (user) {
//       // For authenticated users, use productId from the item
//       const productId = item.id || item.product?.id;
//       if (productId) {
//         removeItem(productId);
//       }
//     } else {
//       // For unauthenticated users, use item id for Redux
//       dispatch(removeFromCartLocalStorage(item.id));
//     }
//   };

//   // Calculate total price
//   const total = Array.isArray(cartItems)
//     ? cartItems.reduce(
//         (acc: number, item: CartItem) =>
//           acc + (item.product?.salePrice || 0) * item.quantity,
//         0
//       )
//     : 0;

//   // Show loading only for authenticated users
//   const showLoading = user && isLoading;
//   const showError = user && isError;
//   const showEmptyCart = !showLoading && !showError && cartItems.length === 0;

//   return (
//     <div className="h-full w-96 bg-white shadow-lg flex flex-col">
//       {/* Header */}
//       <div className="flex justify-between p-4 items-center border-b pb-4">
//         <div className="flex gap-3 items-center">
//           <span
//             onClick={() => dispatch(closeCart())}
//             className="cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
//           >
//             ✕
//           </span>
//           <p className="font-bold text-lg">Your Bag</p>
//           {cartItems.length > 0 && (
//             <span className="text-gray-500">({cartItems.length} items)</span>
//           )}
//         </div>
//       </div>

//       {/* Cart Content */}
//       <div className="flex-1 space-y-4 p-4 overflow-y-auto mt-4">
//         {showLoading && <p className="text-center">Loading...</p>}
//         {showError && (
//           <p className="text-center text-red-500">Failed to load cart</p>
//         )}
//         {showEmptyCart && (
//           <p className="text-gray-500 text-center mt-10">Your cart is empty</p>
//         )}

//         {cartItems.map((item: CartItem) => (
//           <div
//             key={item.id}
//             className="flex items-center justify-between border-b pb-2"
//           >
//             <Image
//               src={item.product?.images?.[0]?.url || "/fallback.png"}
//               alt={item.product?.title || "Product"}
//               width={60}
//               height={60}
//               className="rounded object-cover"
//             />
//             <div className="flex-1 ml-4">
//               <p className="text-sm font-semibold line-clamp-2">
//                 {item.product?.title || "Unknown Product"}
//               </p>
//               <p className="text-sm font-medium">
//                 ₹{item.product?.salePrice || 0}
//               </p>
//               <div className="flex items-center gap-2 mt-1">
//                 <button
//                   onClick={() => handleDecrease(item)}
//                   disabled={isDecreasing || isRemoving}
//                   className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   −
//                 </button>
//                 <span className="px-2 min-w-[2rem] text-center">
//                   {item.quantity}
//                 </span>
//                 <button
//                   onClick={() => handleIncrease(item)}
//                   disabled={isIncreasing || isRemoving}
//                   className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//             <button
//               onClick={() => handleRemove(item)}
//               disabled={isRemoving}
//               className="text-red-500 ml-2 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       {cartItems.length > 0 && (
//         <div className="pt-4 border-t mt-4 -mx-">
//           <div className="bg-surface-10 h-[72px] w-full shadow p-4 flex justify-between items-end">
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Total</p>
//               <p className="text-lg font-semibold text-gray-900">
//                 ₹{total?.toLocaleString()}
//               </p>
//               <p className="text-[10px] text-gray-400">
//                 Inclusive of all taxes
//               </p>
//             </div>

//             <Link
//               href="/checkout"
//               onClick={() => dispatch(closeCart())}
//               className="bg-[#773d4c] text-white uppercase px-10 py-3 text-sm hover:bg-gray-800 transition-colors"
//             >
//               Checkout
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosinstance";
import { useAppDispatch } from "../../../store/hook";
import {
  CartItem,
  closeCart,
  decrementQuantityLocalStorage,
  incrementQuantityLocalStorage,
  removeFromCartLocalStorage,
} from "../../../store/slices/cartSlice";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import useUser from "../../../hooks/useUser";

export default function CartSidebar() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const router = useRouter();

  // Get Redux cart items for unauthenticated users
  const selectCartItems = useSelector((state: RootState) => state.cart.items);

  // Only fetch cart data if user is authenticated
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart/api/get-all-cart", {
        withCredentials: true,
      });
      console.log("Cart data:", res.data.data.cartItems);
      return res.data.data;

      
    },
    enabled: !!user, // Only run query if user exists
  });

  // Use API data for authenticated users, Redux state for unauthenticated users
  const cartItems = user ? data?.cartItems || [] : selectCartItems || [];
  console.log("Cart item from API ", user && data?.cartItems);
  console.log("Cart item from Local storage ", !user && selectCartItems);

  console.log("Cart items:", cartItems);
  console.log("User authenticated:", !!user);

  // Mutations for authenticated users
  const { mutate: increaseQuantity, isPending: isIncreasing } = useMutation({
    mutationFn: async (productId: string) => {
      const res = await axiosInstance.patch(
        "/cart/api/increase-to-cart",
        { productId },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(data?.message || "Quantity increased successfully");
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<any>;
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err.message ||
        "Failed to increase quantity";
      toast.error(errorMessage);
    },
  });

  const { mutate: decreaseQuantity, isPending: isDecreasing } = useMutation({
    mutationFn: async (productId: string) => {
      const res = await axiosInstance.patch(
        "/cart/api/decrease-to-cart",
        { productId },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(data?.message || "Quantity updated successfully");
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<any>;
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err.message ||
        "Failed to decrease quantity";
      toast.error(errorMessage);
    },
  });

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: async (productId: string) => {
      const res = await axiosInstance.delete("/cart/api/remove-to-cart", {
        data: { productId },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(data?.message || "Item removed from cart successfully");
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<any>;
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err.message ||
        "Failed to remove item from cart";
      toast.error(errorMessage);
    },
  });

  // Handle quantity increase - use appropriate method based on user auth status
  const handleIncrease = (item: CartItem) => {
    if (user) {
      // For authenticated users, use productId from the item
      const productId = item.id || item.product?.id;
      if (productId) {
        increaseQuantity(productId);
      }
    } else {
      // For unauthenticated users, use item id for Redux
      dispatch(incrementQuantityLocalStorage(item.id));
    }
  };

  // Handle quantity decrease - use appropriate method based on user auth status
  const handleDecrease = (item: CartItem) => {
    if (user) {
      // For authenticated users, use productId from the item
      const productId = item.id || item.product?.id;
      if (productId) {
        decreaseQuantity(productId);
      }
    } else {
      // For unauthenticated users, use item id for Redux
      dispatch(decrementQuantityLocalStorage(item.id));
    }
  };

  // Handle item removal - use appropriate method based on user auth status
  const handleRemove = (item: CartItem) => {
    if (user) {
      // For authenticated users, use productId from the item
      const productId = item.id || item.product?.id;
      if (productId) {
        removeItem(productId);
      }
    } else {
      // For unauthenticated users, use item id for Redux
      dispatch(removeFromCartLocalStorage(item.id));
    }
  };

  // Handle checkout - redirect to login if not authenticated
  const handleCheckout = () => {
    dispatch(closeCart());

    if (!user) {
      // Store current page URL for redirect after login
      const currentUrl = window.location.pathname + window.location.search;
      // Option 1: Using URL search params (recommended)
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);

      // Option 2: Using localStorage as backup
      // localStorage.setItem('redirectAfterLogin', currentUrl);
      // router.push('/login');

      toast.info("Please login to proceed with checkout");
    } else {
      // User is authenticated, proceed to checkout
      router.push("/checkout");
    }
  };

  // Calculate total price
  const total = Array.isArray(cartItems)
    ? cartItems.reduce(
        (acc: number, item: CartItem) =>
          acc + (item.product?.salePrice || 0) * item.quantity,
        0
      )
    : 0;

  // Show loading only for authenticated users
  const showLoading = user && isLoading;
  const showError = user && isError;
  const showEmptyCart = !showLoading && !showError && cartItems.length === 0;

  return (
    <div className="h-full w-96 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex justify-between p-4 items-center border-b pb-4">
        <div className="flex gap-3 items-center">
          <span
            onClick={() => dispatch(closeCart())}
            className="cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </span>
          <p className="font-bold text-lg">Your Bag</p>
          {cartItems.length > 0 && (
            <span className="text-gray-500">({cartItems.length} items)</span>
          )}
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 space-y-4 p-4 overflow-y-auto mt-4">
        {showLoading && <p className="text-center">Loading...</p>}
        {showError && (
          <p className="text-center text-red-500">Failed to load cart</p>
        )}
        {showEmptyCart && (
          <p className="text-gray-500 text-center mt-10">Your cart is empty</p>
        )}

        {cartItems.map((item: CartItem) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <Image
              src={item.product?.images?.[0]?.url || "/fallback.png"}
              alt={item.product?.title || "Product"}
              width={60}
              height={60}
              className="rounded object-cover"
            />
            <div className="flex-1 ml-4">
              <p className="text-sm font-semibold line-clamp-2">
                {item.product?.title || "Unknown Product"}
              </p>
              <p className="text-sm font-medium">
                ₹{item.product?.salePrice || 0}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleDecrease(item)}
                  disabled={isDecreasing || isRemoving}
                  className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <span className="px-2 min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleIncrease(item)}
                  disabled={isIncreasing || isRemoving}
                  className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item)}
              disabled={isRemoving}
              className="text-red-500 ml-2 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="pt-4 border-t mt-4 -mx-">
          <div className="bg-surface-10 h-[72px] w-full shadow p-4 flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-lg font-semibold text-gray-900">
                ₹{total?.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">
                Inclusive of all taxes
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="bg-[#773d4c] text-white uppercase px-10 py-3 text-sm hover:bg-gray-800 transition-colors"
            >
              {!user ? "Login to Checkout" : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
