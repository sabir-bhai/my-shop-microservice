// // "use client";
// // import React from "react";
// // import { useForm } from "react-hook-form";
// // import { useMutation } from "@tanstack/react-query";
// // import axiosInstance from "../../../utils/axiosinstance";
// // import { toast } from "sonner";
// // interface AddAddressModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// // }

// // const AddAddressModal: React.FC<AddAddressModalProps> = ({
// //   isOpen,
// //   onClose,
// // }) => {
// //   const {
// //     register,
// //     handleSubmit,
// //     setValue,
// //     formState: { errors },
// //   } = useForm({
// //     defaultValues: {
// //       pincode: "",
// //       city: "",
// //       state: "",
// //       address: "",
// //       locality: "",
// //       type: "Home",
// //       name: "",
// //       phone: "",
// //     },
// //   });

// //   // React Query mutation
// //   const { mutate: addAddress, isPending } = useMutation({
// //     mutationFn: async (body: any) => {
// //       const res = await axiosInstance.post("/api/add-address", body, {
// //         withCredentials: true,
// //       });
// //       return res.data;
// //     },
// //     onSuccess: () => {
// //       onClose();
// //     },
// //     onError: (err: any) => {
// //       console.log("console error", err?.response?.data);
// //       const apiMsg =
// //         err?.response?.data?.error?.message ||
// //         "Failed to add address. Please try again.";

// //       toast.error(apiMsg);
// //     },
// //   });

// //   const onSubmit = (data: any) => {
// //     addAddress(data); // call the API
// //   };

// //   const handleTypeSelect = (type: string) => {
// //     console.log("Type is", type);
// //     setValue("type", type);
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
// //       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
// //         <div className="flex justify-between items-center mb 4">
// //           <h2 className="text-lg font-semibold text-gray-900">
// //             Add an Address
// //           </h2>
// //           <button
// //             onClick={onClose}
// //             className="text-gray-500 hover:text-gray-800 text-xl"
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         {/* Form starts */}
// //         <form onSubmit={handleSubmit(onSubmit)}>
// //           <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
// //             {/* Pincode */}
// //             <div>
// //               <label className="text-sm font-medium">Pincode *</label>
// //               <input
// //                 type="text"
// //                 {...register("pincode", { required: true })}
// //                 className="w-full border rounded px-3 py-2"
// //               />
// //               {errors.pincode && (
// //                 <span className="text-xs text-red-500">
// //                   Pincode is required
// //                 </span>
// //               )}
// //             </div>

// //             {/* City & State */}
// //             <div className="flex gap-2">
// //               <div className="flex-1">
// //                 <label className="text-sm font-medium">City/District *</label>
// //                 <input
// //                   type="text"
// //                   {...register("city", { required: true })}
// //                   className="w-full border rounded px-3 py-2"
// //                 />
// //               </div>
// //               <div className="flex-1">
// //                 <label className="text-sm font-medium">State *</label>
// //                 <input
// //                   type="text"
// //                   {...register("state", { required: true })}
// //                   className="w-full border rounded px-3 py-2"
// //                 />
// //               </div>
// //             </div>

// //             {/* Address */}
// //             <div>
// //               <label className="text-sm font-medium">Address *</label>
// //               <input
// //                 type="text"
// //                 {...register("address", { required: true })}
// //                 className="w-full border rounded px-3 py-2"
// //               />
// //             </div>

// //             {/* Locality */}
// //             <div>
// //               <label className="text-sm font-medium">Locality/Town *</label>
// //               <input
// //                 type="text"
// //                 {...register("locality", { required: true })}
// //                 className="w-full border rounded px-3 py-2"
// //               />
// //             </div>

// //             {/* Address Type */}
// //             <div>
// //               <label className="text-sm font-medium">Save Address as</label>
// //               <div className="flex gap-2 mt-1">
// //                 {["Home", "Office", "Others"].map((type) => (
// //                   <button
// //                     key={type}
// //                     type="button"
// //                     onClick={() => handleTypeSelect(type)}
// //                     className={`px-4 py-2 rounded border ${
// //                       // You can display selected type using conditional styling if you want
// //                       ""
// //                     }`}
// //                   >
// //                     {type}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Name */}
// //             <div>
// //               <label className="text-sm font-medium">Name *</label>
// //               <input
// //                 type="text"
// //                 {...register("name", { required: true })}
// //                 className="w-full border rounded px-3 py-2"
// //               />
// //             </div>

// //             {/* Phone */}
// //             <div>
// //               <label className="text-sm font-medium">Mobile No *</label>
// //               <input
// //                 type="text"
// //                 {...register("phone", { required: true })}
// //                 className="w-full border rounded px-3 py-2"
// //               />
// //             </div>
// //           </div>

// //           {/* Submit */}
// //           <div className="mt-6 w-full">
// //             <button
// //               type="submit"
// //               className="w-full bg-[#773D4C] text-white py-3 rounded-lg font-medium hover:bg-[#5f303d] transition shadow-SideSheetBoxShadow"
// //               disabled={isPending}
// //             >
// //               {isPending ? "Saving..." : "ADD ADDRESS"}
// //             </button>
// //           </div>
// //         </form>
// //         {/* Form ends */}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddAddressModal;

// // ===== UPDATED AddressList Component =====
// "use client";
// import React, { useState } from "react";
// import { Plus, Edit, MapPin, Phone } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "../../../utils/axiosinstance";

// type Address = {
//   id: string;
//   street: string;
//   city: string;
//   state: string;
//   pincode: string;
//   country: string;
//   isDefault?: boolean;
//   contactName?: string;
//   contactPhone?: string;
//   // ADDED: Additional fields for edit functionality
//   locality?: string;
//   type?: string;
//   name?: string;
//   phone?: string;
// };

// type AddressListProps = {
//   onAddAddress: () => void;
//   onSelectAddress?: (address: Address) => void;
//   selectedAddressId?: string;
//   showSelection?: boolean;
//   // ADDED: Edit address callback
//   onEditAddress?: (address: Address) => void;
// };

// const AddressList: React.FC<AddressListProps> = ({
//   onAddAddress,
//   onSelectAddress,
//   selectedAddressId,
//   showSelection = false,
//   // ADDED: Edit address prop
//   onEditAddress,
// }) => {
//   const [selectedId, setSelectedId] = useState<string>(selectedAddressId || "");

//   // Fetch addresses using TanStack Query with axios
//   const {
//     data: addressesResponse,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["addresses"],
//     queryFn: async () => {
//       const response = await axiosInstance.get("/api/get-address", {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//           "Cache-Control": "no-cache",
//         },
//       });

//       return response.data;
//     },
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//     retry: (failureCount, error: any) => {
//       if (error?.response?.status === 304) {
//         return false;
//       }
//       if (error?.response?.status >= 400 && error?.response?.status < 500) {
//         return false;
//       }
//       return failureCount < 3;
//     },
//     refetchOnWindowFocus: false,
//     refetchOnMount: true,
//   });

//   const addresses = addressesResponse?.data || [];

//   const handleAddressSelect = (address: Address) => {
//     if (showSelection) {
//       setSelectedId(address.id);
//       onSelectAddress?.(address);
//     }
//   };

//   // ADDED: Handle edit address
//   const handleEditAddress = (address: Address) => {
//     if (onEditAddress) {
//       onEditAddress(address);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b2c3a]"></div>
//         <p className="text-gray-600 mt-4">Loading addresses...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 text-center">
//         <div className="text-red-500 mb-4">
//           <MapPin size={48} />
//         </div>
//         <p className="text-red-600 font-medium mb-2">
//           Failed to load addresses
//         </p>
//         <p className="text-gray-600 text-sm mb-4">
//           {error?.response?.data?.message ||
//             error?.message ||
//             "Something went wrong"}
//         </p>
//         <div className="flex gap-2">
//           <button
//             onClick={() => refetch()}
//             className="px-4 py-2 text-[#6b2c3a] border border-[#6b2c3a] rounded hover:bg-[#6b2c3a] hover:text-white transition"
//           >
//             Try Again
//           </button>
//           <button
//             onClick={onAddAddress}
//             className="flex items-center gap-2 bg-[#6b2c3a] text-white px-4 py-2 rounded hover:bg-[#5a252f] transition"
//           >
//             <Plus size={16} /> Add Address
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (addresses.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-center py-12">
//         <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//           <MapPin size={48} className="text-gray-400" />
//         </div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">
//           No addresses found
//         </h3>
//         <p className="text-gray-600 text-sm mb-6 max-w-md">
//           You don't have any saved addresses. Add an address to continue with
//           your order.
//         </p>
//         <button
//           onClick={onAddAddress}
//           className="flex items-center gap-2 bg-[#6b2c3a] text-white px-6 py-3 rounded-lg hover:bg-[#5a252f] transition font-medium"
//         >
//           <Plus size={18} /> Add New Address
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">
//             {showSelection ? "Select Delivery Address" : "Your Addresses"}
//           </h2>
//           <p className="text-sm text-gray-600 mt-1">
//             {addresses.length} address{addresses.length !== 1 ? "es" : ""} saved
//           </p>
//         </div>
//         <button
//           onClick={onAddAddress}
//           className="flex items-center gap-2 border border-[#6b2c3a] text-[#6b2c3a] px-4 py-2 rounded-lg hover:bg-[#6b2c3a] hover:text-white transition"
//         >
//           <Plus size={16} /> Add New Address
//         </button>
//       </div>

//       {/* Address List */}
//       <div className="space-y-3">
//         {addresses.map((address: Address) => (
//           <div
//             key={address.id}
//             className={`
//               border rounded-lg p-4 transition-all cursor-pointer
//               ${
//                 showSelection && selectedId === address.id
//                   ? "border-[#6b2c3a] bg-[#6b2c3a]/5 shadow-md"
//                   : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//               }
//             `}
//             onClick={() => handleAddressSelect(address)}
//           >
//             <div className="flex items-start gap-3">
//               {/* Radio button for selection */}
//               {showSelection && (
//                 <div className="flex-shrink-0 mt-1">
//                   <input
//                     type="radio"
//                     name="address"
//                     checked={selectedId === address.id}
//                     onChange={() => handleAddressSelect(address)}
//                     className="w-4 h-4 text-[#6b2c3a] border-gray-300 focus:ring-[#6b2c3a]"
//                   />
//                 </div>
//               )}

//               {/* Address Content */}
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <h3 className="font-medium text-gray-900">
//                     {address.contactName || address.name || "Home"}
//                   </h3>
//                   {address.isDefault && (
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
//                       DEFAULT
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-1 text-sm text-gray-600">
//                   <p>{address.street}</p>
//                   <p>
//                     {address.city}, {address.state} - {address.pincode}
//                   </p>
//                   <p>{address.country}</p>
//                   {(address.contactPhone || address.phone) && (
//                     <div className="flex items-center gap-1 mt-2">
//                       <Phone size={14} />
//                       <span>{address.contactPhone || address.phone}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Edit button - UPDATED */}
//               <div className="flex-shrink-0">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // UPDATED: Call handleEditAddress instead of console.log
//                     handleEditAddress(address);
//                   }}
//                   className="p-2 text-gray-400 hover:text-gray-600 transition"
//                 >
//                   <Edit size={16} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AddressList;

"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "sonner";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  // ADDED: Edit mode props
  editAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    locality?: string;
    type?: string;
    name?: string;
    phone?: string;
  } | null;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  // ADDED: Edit address prop
  editAddress,
}) => {
  console.log("This edit address", editAddress);
  // ADDED: Query client for cache invalidation
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pincode: "",
      city: "",
      state: "",
      address: "",
      locality: "",
      type: "Home",
      name: "",
      phone: "",
    },
  });

  // ADDED: Watch the type field to show selected state
  const watchedType = watch("type");

  // ADDED: Effect to populate form when editing
  useEffect(() => {
    if (editAddress) {
      // Pre-populate form with edit data
      setValue("pincode", editAddress.pincode || "");
      setValue("city", editAddress.city || "");
      setValue("state", editAddress.state || "");
      setValue("address", editAddress.street || "");
      setValue("locality", editAddress.locality || "");
      setValue("type", editAddress.type || "Home");
      setValue("name", editAddress.name || "");
      setValue("phone", editAddress.phone || "");
    } else {
      // Reset form for add mode
      reset({
        pincode: "",
        city: "",
        state: "",
        address: "",
        locality: "",
        type: "Home",
        name: "",
        phone: "",
      });
    }
  }, [editAddress, setValue, reset]);

  // UPDATED: Mutation to handle both add and edit
  const { mutate: saveAddress, isPending } = useMutation({
    mutationFn: async (body: any) => {
      if (editAddress) {
        // Edit existing address
        const res = await axiosInstance.put(
          `/api/update-address/${editAddress.id}`,
          body,
          {
            withCredentials: true,
          }
        );
        return res.data;
      } else {
        // Add new address
        const res = await axiosInstance.post("/api/add-address", body, {
          withCredentials: true,
        });
        return res.data;
      }
    },
    onSuccess: () => {
      // ADDED: Invalidate addresses cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["addresses"] });

      toast.success(
        editAddress
          ? "Address updated successfully!"
          : "Address added successfully!"
      );
      onClose();
    },
    onError: (err: any) => {
      console.log("console error", err?.response?.data);
      const apiMsg =
        err?.response?.data?.error?.message ||
        `Failed to ${
          editAddress ? "update" : "add"
        } address. Please try again.`;

      toast.error(apiMsg);
    },
  });

  const onSubmit = (data: any) => {
    saveAddress(data);
  };

  const handleTypeSelect = (type: string) => {
    setValue("type", type);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          {/* UPDATED: Dynamic title based on edit mode */}
          <h2 className="text-lg font-semibold text-gray-900">
            {editAddress ? "Edit Address" : "Add an Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form starts */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
            {/* Pincode */}
            <div>
              <label className="text-sm font-medium">Pincode *</label>
              <input
                type="text"
                {...register("pincode", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.pincode && (
                <span className="text-xs text-red-500">
                  Pincode is required
                </span>
              )}
            </div>

            {/* City & State */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium">City/District *</label>
                <input
                  type="text"
                  {...register("city", { required: true })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">State *</label>
                <input
                  type="text"
                  {...register("state", { required: true })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium">Address *</label>
              <input
                type="text"
                {...register("address", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Locality */}
            <div>
              <label className="text-sm font-medium">Locality/Town *</label>
              <input
                type="text"
                {...register("locality", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Address Type - UPDATED with visual feedback */}
            <div>
              <label className="text-sm font-medium">Save Address as</label>
              <div className="flex gap-2 mt-1">
                {["Home", "Office", "Others"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`px-4 py-2 rounded border transition ${
                      watchedType === type
                        ? "bg-[#773D4C] text-white border-[#773D4C]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#773D4C]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium">Name *</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">Mobile No *</label>
              <input
                type="text"
                {...register("phone", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Submit - UPDATED button text */}
          <div className="mt-6 w-full">
            <button
              type="submit"
              className="w-full bg-[#773D4C] text-white py-3 rounded-lg font-medium hover:bg-[#5f303d] transition shadow-SideSheetBoxShadow"
              disabled={isPending}
            >
              {isPending
                ? editAddress
                  ? "Updating..."
                  : "Saving..."
                : editAddress
                ? "UPDATE ADDRESS"
                : "ADD ADDRESS"}
            </button>
          </div>
        </form>
        {/* Form ends */}
      </div>
    </div>
  );
};

export default AddAddressModal;
