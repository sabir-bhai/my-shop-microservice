"use client";
import React, { useState } from "react";
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import ProductImages from "./components/ProductImages";
import ActionButtons from "./components/ActionButtons";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface FormData {
  title: string;
  slug: string;
  description: string;
  regularPrice: string;
  salePrice: string;
  warranty: string;
  category: string;
  sku: string;
  stockQuantity: string;
  discountCode: string;
  tags: string;
  publicationStatus: string;
  featuredProduct: boolean;
}

export default function Page() {
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      regularPrice: "0.00",
      salePrice: "0.00",
      warranty: "1 year warranty",
      category: "",
      sku: "",
      stockQuantity: "0",
      discountCode: "",
      tags: "",
      publicationStatus: "Draft",
      featuredProduct: false,
    },
  });

  // Convert File → Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // React Query Mutation
  const createProductMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axios.post(
        "http://localhost:8080/product/api",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return data;
    },
    onSuccess: (data) => {
      alert("✅ Product created successfully!");
      console.log("Backend Response:", data);
    },
    onError: (error: any) => {
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    },
  });

  // Form submit handler
  const handleFormSubmit = async (data: FormData) => {
    if (images.length === 0) {
      alert("⚠️ Please upload at least one image");
      return;
    }

    const base64Images = await Promise.all(
      images.map((file) => convertToBase64(file))
    );

    const payload = {
      ...data,
      tags: data.tags.split(",").map((tag) => tag.trim()),
      images: base64Images,
    };

    createProductMutation.mutate(payload);
  };

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files);
    setImages((prev) => [...prev, ...newImages].slice(0, 8));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6  relative">
      <Header />

      {/* Form wrapper with bottom padding to prevent overlap */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductForm
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
          <ProductImages
            uploadedImages={images.map((file) => URL.createObjectURL(file))}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
          />
        </div>
      </form>

      {/* Fixed ActionButtons container - respects parent width */}
      {/* Fixed ActionButtons container - respects parent width */}
      <div className="fixed bottom-0  w-[78%] right-0 bg-gray-800 border border-gray-700  px-6">
        <ActionButtons isLoading={createProductMutation.isPending} />
      </div>
    </div>
  );
}
