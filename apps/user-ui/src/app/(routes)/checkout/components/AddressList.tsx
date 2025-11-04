"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit,
  MapPin,
  Phone,
  Home,
  Building2,
  MoreHorizontal,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosinstance";

type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
  contactName?: string;
  contactPhone?: string;
  locality?: string;
  type?: string;
  name?: string;
  phone?: string;
};

type AddressListProps = {
  onAddAddress: () => void;
  onSelectAddress?: (address: Address) => void;
  selectedAddressId?: string;
  showSelection?: boolean;
  onEditAddress?: (address: Address) => void;
};

const AddressList: React.FC<AddressListProps> = ({
  onAddAddress,
  onSelectAddress,
  selectedAddressId,
  showSelection = false,
  onEditAddress,
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedAddressId || "");

  const {
    data: addressesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/get-address", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 304) {
        return false;
      }
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const addresses = addressesResponse?.data || [];

  const handleAddressSelect = (address: Address) => {
    if (showSelection) {
      setSelectedId(address.id);
      onSelectAddress?.(address);
    }
  };

  const handleEditAddress = (address: Address) => {
    if (onEditAddress) {
      onEditAddress(address);
    }
  };

  const getAddressTypeIcon = (type?: string) => {
    switch (type) {
      case "Home":
        return <Home className="w-4 h-4" />;
      case "Office":
        return <Building2 className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-surface-10 rounded-xl shadow-BagBoxShadow overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-surface-10" />
            <h2 className="sub-heading-01-bold text-surface-10">
              Delivery Address
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-secondary-60 border-t-transparent rounded-full animate-spin"></div>
          <p className="paragraph-06-regular text-neutral-60 mt-4">
            Loading addresses...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-surface-10 rounded-xl shadow-BagBoxShadow overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-surface-10" />
            <h2 className="sub-heading-01-bold text-surface-10">
              Delivery Address
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-20 h-20 bg-error-10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-error-40" />
          </div>
          <h3 className="sub-heading-04-bold text-neutral-90 mb-2">
            Failed to Load Addresses
          </h3>
          <p className="paragraph-06-regular text-neutral-60 mb-6 max-w-md">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong. Please try again."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 paragraph-06-medium text-secondary-60 border-2 border-secondary-60 px-5 py-2.5 rounded-lg hover:bg-secondary-60 hover:text-surface-10 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={onAddAddress}
              className="flex items-center gap-2 paragraph-06-medium bg-gradient-to-r from-secondary-60 to-secondary-50 text-surface-10 px-5 py-2.5 rounded-lg hover:from-secondary-70 hover:to-secondary-60 transition-all duration-300 shadow-custom"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (addresses.length === 0) {
    return (
      <div className="bg-surface-10 rounded-xl shadow-BagBoxShadow overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-surface-10" />
            <h2 className="sub-heading-01-bold text-surface-10">
              Delivery Address
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-32 h-32 bg-primary-30 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <MapPin className="w-16 h-16 text-secondary-60" />
          </div>
          <h3 className="sub-heading-04-bold text-neutral-90 mb-2">
            No Saved Addresses
          </h3>
          <p className="paragraph-06-regular text-neutral-60 mb-6 max-w-md">
            You don't have any saved addresses yet. Add a delivery address to
            continue with your order.
          </p>
          <button
            onClick={onAddAddress}
            className="flex items-center gap-2 paragraph-06-medium bg-gradient-to-r from-secondary-60 to-secondary-50 text-surface-10 px-6 py-3 rounded-lg hover:from-secondary-70 hover:to-secondary-60 transition-all duration-300 shadow-custom hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-10 rounded-xl shadow-BagBoxShadow overflow-hidden">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-surface-10" />
          <div>
            <h2 className="sub-heading-01-bold text-surface-10">
              {showSelection ? "Select Delivery Address" : "Your Addresses"}
            </h2>
            <p className="paragraph-08-regular text-surface-10 text-opacity-80 mt-0.5">
              {addresses.length} saved{" "}
              {addresses.length === 1 ? "address" : "addresses"}
            </p>
          </div>
        </div>
        <button
          onClick={onAddAddress}
          className="flex items-center gap-2 paragraph-07-medium bg-surface-10 text-secondary-60 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add New</span>
        </button>
      </div>

      {/* Address List */}
      <div className="p-6 space-y-4">
        {addresses.map((address: Address) => (
          <div
            key={address.id}
            className={`border-2 rounded-xl p-5 transition-all duration-300 cursor-pointer group ${
              showSelection && selectedId === address.id
                ? "border-secondary-60 bg-secondary-10 shadow-custom"
                : "border-neutral-10 hover:border-secondary-60 hover:shadow-sm"
            }`}
            onClick={() => handleAddressSelect(address)}
          >
            <div className="flex items-start gap-4">
              {/* Radio button for selection */}
              {showSelection && (
                <div className="flex-shrink-0 mt-1">
                  <div className="relative">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedId === address.id}
                      onChange={() => handleAddressSelect(address)}
                      className="w-5 h-5 text-secondary-60 border-2 border-neutral-30 focus:ring-secondary-60 focus:ring-2 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Address Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`flex items-center gap-1.5 paragraph-06-medium ${
                      selectedId === address.id
                        ? "text-secondary-60"
                        : "text-neutral-90"
                    }`}
                  >
                    {getAddressTypeIcon(address.type)}
                    <span>
                      {address.contactName ||
                        address.name ||
                        address.type ||
                        "Home"}
                    </span>
                  </div>
                  {address.isDefault && (
                    <span className="paragraph-09-medium bg-success-10 text-success-40 px-2 py-1 rounded-full">
                      DEFAULT
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 paragraph-07-regular text-neutral-60">
                  <p className="text-neutral-80">{address.street}</p>
                  {address.locality && <p>{address.locality}</p>}
                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p>{address.country}</p>
                  {(address.contactPhone || address.phone) && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-10">
                      <Phone className="w-4 h-4 text-secondary-60" />
                      <span className="paragraph-06-medium text-neutral-80">
                        {address.contactPhone || address.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit button */}
              <div className="flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(address);
                  }}
                  className="p-2.5 text-neutral-40 hover:text-secondary-60 hover:bg-secondary-10 rounded-lg transition-all duration-300 group-hover:bg-secondary-10"
                  aria-label="Edit address"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {showSelection && (
        <div className="bg-primary-20 px-6 py-4 border-t border-neutral-10">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-secondary-60 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="paragraph-07-medium text-neutral-80 mb-1">
                Delivery Information
              </p>
              <p className="paragraph-08-regular text-neutral-60">
                Select an address to continue with your order. You can add a new
                address or edit existing ones.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressList;
