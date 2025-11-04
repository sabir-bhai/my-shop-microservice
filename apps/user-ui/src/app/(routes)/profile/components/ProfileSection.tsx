"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { User as UserIcon, Camera, Save, Check } from "lucide-react";
import useUser from "../../../hooks/useUser";
import axiosInstance from "../../../utils/axiosinstance";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
};

type FieldDef = {
  label: string;
  key: keyof FormData;
  placeholder?: string;
  icon?: React.ReactNode;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
};

const fields: FieldDef[] = [
  { label: "First Name", key: "firstName", placeholder: "Enter first name" },
  { label: "Last Name", key: "lastName", placeholder: "Enter last name" },
  {
    label: "Email Address",
    key: "email",
    icon: <UserIcon size={16} />,
    placeholder: "you@example.com",
  },
  {
    label: "Phone Number",
    key: "phone",
    icon: <UserIcon size={16} />,
    placeholder: "+91 98765 43210",
  },
];

function ProfileDetails() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const splitName = useMemo(() => {
    const full = user?.name?.trim() ?? "";
    if (!full) return { firstName: "", lastName: "" };
    const parts = full.split(/\s+/);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" ") ?? "",
    };
  }, [user?.name]);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      firstName: splitName.firstName,
      lastName: splitName.lastName,
      email: user.email ?? "",
      phone: user.phone ?? "",
      avatar: "",
    }));
  }, [user, splitName]);

  if (isLoading) return <p>Loading profile…</p>;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview in UI
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Convert to base64 data URL for backend
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((p) => ({ ...p, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);

    event.target.value = ""; // reset input
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone || null,
        avatar: formData.avatar || undefined, // base64 data URL or undefined
      };
      await axiosInstance.put("/users/api/profile", payload);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-6 mb-6 md:mb-0">
        <div className="relative">
          <img
            src={preview || user?.avater || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-[#773d4c]"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-[#773d4c] text-white p-2 rounded-full shadow-md hover:opacity-90 transition-opacity"
          >
            <Camera size={14} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#773d4c]">{user?.name}</h1>
          <p className="text-[#773d4c]/70 mt-1">{user?.email}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-[#773d4c] text-white text-xs rounded-full font-medium">
              Premium Member
            </span>
            <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium flex items-center gap-1">
              <Check size={12} />
              Verified
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing((v) => !v)}
            className="px-4 py-2 bg-[#773d4c] text-white rounded-2xl hover:opacity-90 transition-opacity"
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(
            ({ label, key, icon, placeholder, isSelect, options }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#773d4c]/90 mb-2">
                  {label}
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={formData[key] ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, [key]: e.target.value }))
                      }
                      readOnly={key === "email"}
                      className={`w-full px-4 py-3 pl-12 bg-[#dedcdc] border border-[#773d4c] rounded-2xl 
                      ${
                        key === "email"
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-[#773d4c]"
                      } 
                      placeholder-black`}
                    />
                    {icon && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80">
                        {icon}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-full px-4 py-3 pl-12 bg-white border border-[#773d4c]/30 rounded-2xl text-[#773d4c]">
                      {formData[key] || "—"}
                    </div>
                    {icon && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#773d4c]/70">
                        {icon}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-600 text-white font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDetails;
