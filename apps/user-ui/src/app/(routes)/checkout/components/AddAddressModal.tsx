"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "sonner";
import { X, MapPin, User, Phone, Home, Building2, MoreHorizontal } from "lucide-react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  editAddress,
}) => {
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

  const watchedType = watch("type");

  useEffect(() => {
    if (editAddress) {
      setValue("pincode", editAddress.pincode || "");
      setValue("city", editAddress.city || "");
      setValue("state", editAddress.state || "");
      setValue("address", editAddress.street || "");
      setValue("locality", editAddress.locality || "");
      setValue("type", editAddress.type || "Home");
      setValue("name", editAddress.name || "");
      setValue("phone", editAddress.phone || "");
    } else {
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

  const { mutate: saveAddress, isPending } = useMutation({
    mutationFn: async (body: any) => {
      // Note: Backend doesn't have update endpoint yet, only add
      const res = await axiosInstance.post("/users/api/address", body, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });

      toast.success(
        editAddress
          ? "Address updated successfully!"
          : "Address added successfully!",
        {
          icon: "✓",
          duration: 3000,
        }
      );
      onClose();
    },
    onError: (err: any) => {
      const apiMsg =
        err?.response?.data?.error?.message ||
        `Failed to ${
          editAddress ? "update" : "add"
        } address. Please try again.`;

      toast.error(apiMsg, {
        icon: "✕",
        duration: 4000,
      });
    },
  });

  const onSubmit = (data: any) => {
    saveAddress(data);
  };

  const handleTypeSelect = (type: string) => {
    setValue("type", type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Home":
        return <Home className="w-4 h-4" />;
      case "Office":
        return <Building2 className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(119, 61, 76, 0.6)' }}>
      <div className="bg-surface-10 rounded-2xl shadow-BagBoxShadowV2 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-secondary-60 to-secondary-50 px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-surface-10 rounded-full w-10 h-10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary-60" />
              </div>
              <h2 className="sub-heading-01-bold text-surface-10">
                {editAddress ? "Edit Address" : "Add New Address"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-surface-10 hover:bg-surface-10 hover:bg-opacity-20 rounded-full p-2 transition-all duration-300"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-5 max-h-[65vh] overflow-y-auto scrollbar-hide pr-2">
            {/* Address Type Selection */}
            <div>
              <label className="paragraph-06-medium text-neutral-80 mb-3 block">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Home", "Office", "Others"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`paragraph-06-medium h-12 rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                      watchedType === type
                        ? "bg-secondary-60 text-surface-10 border-secondary-60 shadow-custom"
                        : "bg-surface-10 text-neutral-60 border-neutral-10 hover:border-secondary-60 hover:text-secondary-60"
                    }`}
                  >
                    {getTypeIcon(type)}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="paragraph-07-medium text-neutral-80 mb-2 flex items-center gap-1">
                  <User className="w-4 h-4 text-secondary-60" />
                  Full Name <span className="text-error-40">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full h-11 px-4 paragraph-06-regular border-2 rounded-lg outline-none transition-all duration-300 bg-surface-10 ${
                    errors.name
                      ? "border-error-40 focus:border-error-40"
                      : "border-neutral-10 focus:border-secondary-60"
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <span className="paragraph-09-medium text-error-40 mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="paragraph-07-medium text-neutral-80 mb-2 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-secondary-60" />
                  Mobile Number <span className="text-error-40">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit number",
                    },
                  })}
                  className={`w-full h-11 px-4 paragraph-06-regular border-2 rounded-lg outline-none transition-all duration-300 bg-surface-10 ${
                    errors.phone
                      ? "border-error-40 focus:border-error-40"
                      : "border-neutral-10 focus:border-secondary-60"
                  }`}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                {errors.phone && (
                  <span className="paragraph-09-medium text-error-40 mt-1 block">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            {/* Address Details */}
            <div>
              <label className="paragraph-07-medium text-neutral-80 mb-2 block">
                Address (House No, Building, Street) <span className="text-error-40">*</span>
              </label>
              <input
                type="text"
                {...register("address", { required: "Address is required" })}
                className={`w-full h-11 px-4 paragraph-06-regular border-2 rounded-lg outline-none transition-all duration-300 bg-surface-10 ${
                  errors.address
                    ? "border-error-40 focus:border-error-40"
                    : "border-neutral-10 focus:border-secondary-60"
                }`}
                placeholder="House no., Building name, Street"
              />
              {errors.address && (
                <span className="paragraph-09-medium text-error-40 mt-1 block">
                  {errors.address.message}
                </span>
              )}
            </div>

            <div>
              <label className="paragraph-07-medium text-neutral-80 mb-2 block">
                Locality/Area <span className="text-error-40">*</span>
              </label>
              <input
                type="text"
                {...register("locality", { required: "Locality is required" })}
                className={`w-full h-11 px-4 paragraph-06-regular border-2 rounded-lg outline-none transition-all duration-300 bg-surface-10 ${
                  errors.locality
                    ? "border-error-40 focus:border-error-40"
                    : "border-neutral-10 focus:border-secondary-60"
                }`}
                placeholder="Locality, Town or Area"
              />
              {errors.locality && (
                <span className="paragraph-09-medium text-error-40 mt-1 block">
                  {errors.locality.message}
                </span>
              )}
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="paragraph-07-medium text-neutral-80 mb-2 block">
                  City <span className="text-error-40">*</span>
                </label>
                <input
                  type="text"
                  {...register("city", { required: "City is required" })}
                  className={`w-full h-11 px-4 paragraph-06-regular border-2 rounded-lg outline-none transition-all duration-300 bg-surface-10 ${
                    errors.city
                      ? "border-error-40 focus:border-error-40"
                      : "border-neutral-10 focus:border-secondary-60"
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <span className="paragraph-09-medium text-error-40 mt-1 block">
                    {errors.city.message}
                  </span>
                )}
              </div>

              <div>
                <label className="paragraph-07-medium text-neutral-80 mb-2 block">
                  State <span className="text-error-40">*</span>
                </label>
                <input
                  type="text"
                  {...register("state", { required: "State is required" })}
                  className={`w-full h-11 px-4 paragraph-06-regular border-2 rounded-lg outline-none transition-all duration-300 bg-surface-10 ${
                    errors.state
                      ? "border-error-40 focus:border-error-40"
                      : "border-neutral-10 focus:border-secondary-60"
                  }`}
                  placeholder="State"
                />
                {errors.state && (
                  <span className="paragraph-09-medium text-error-40 mt-1 block">
                    {errors.state.message}
                  </span>
                )}
              </div>

              <div>
                <label className="paragraph-07-medium text-neutral-80 mb-2 block">
                  Pincode <span className="text-error-40">*</span>
                </label>
                <input
                  type="text"
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Enter a valid 6-digit pincode",
                    },
                  })}
                  className={`w-full h-11 px-4 paragraph-06-regular border-2 rounded-lg outline-none transition-all duration-300 bg-surface-10 ${
                    errors.pincode
                      ? "border-error-40 focus:border-error-40"
                      : "border-neutral-10 focus:border-secondary-60"
                  }`}
                  placeholder="6-digit"
                  maxLength={6}
                />
                {errors.pincode && (
                  <span className="paragraph-09-medium text-error-40 mt-1 block">
                    {errors.pincode.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-neutral-10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 paragraph-06-medium text-neutral-60 h-12 rounded-lg border-2 border-neutral-10 hover:border-neutral-20 hover:bg-neutral-10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 paragraph-06-medium bg-gradient-to-r from-secondary-60 to-secondary-50 text-surface-10 h-12 rounded-lg hover:from-secondary-70 hover:to-secondary-60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-custom hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-surface-10 border-t-transparent rounded-full animate-spin"></div>
                  <span>{editAddress ? "Updating..." : "Saving..."}</span>
                </>
              ) : (
                <span>{editAddress ? "UPDATE ADDRESS" : "SAVE ADDRESS"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
