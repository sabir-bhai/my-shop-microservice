"use client";

import React, { useState, useMemo } from "react";
import { Button } from "./ui/index";
import SearchBar from "./components/SearchBar";
import CouponTable from "./components/CouponTable";
import CouponForm from "./components/CouponForm";
import { mockCoupons } from "./data/mockCoupons";
import { Coupon, CouponFormData } from "./types/coupon";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        searchQuery === "" ||
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "" || coupon.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleDuplicateCoupon = (coupon: Coupon) => {
    const duplicatedCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      code: `${coupon.code}_COPY`,
      name: `${coupon.name} (Copy)`,
      status: "draft",
      usage: { current: 0, total: coupon.usage.total },
    };

    setCoupons((prev) => [duplicatedCoupon, ...prev]);
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
    }
  };

  const handleFormSubmit = (formData: CouponFormData) => {
    if (editingCoupon) {
      // Update existing coupon
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === editingCoupon.id
            ? {
                ...formData,
                id: editingCoupon.id,
                usage: editingCoupon.usage,
              }
            : coupon
        )
      );
    } else {
      // Create new coupon
      const newCoupon: Coupon = {
        ...formData,
        id: Date.now().toString(),
        usage: { current: 0, total: formData.limits?.totalUsage || 0 },
      };
      setCoupons((prev) => [newCoupon, ...prev]);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Coupon Management</h1>
          <Button onClick={handleCreateCoupon}>Create Coupon</Button>
        </div>

        <SearchBar
          onSearch={setSearchQuery}
          onStatusFilter={setStatusFilter}
          placeholder="Search coupons..."
        />

        <CouponTable
          coupons={filteredCoupons}
          onEdit={handleEditCoupon}
          onDuplicate={handleDuplicateCoupon}
          onDelete={handleDeleteCoupon}
        />

        <CouponForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingCoupon || undefined}
          title={editingCoupon ? "Edit Coupon" : "Create New Coupon"}
        />
      </div>
    </div>
  );
};

export default CouponsPage;
