import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Banner } from "../types/banner";

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Omit<Banner, "id" | "created" | "updated">) => void;
}

export const CreateBannerModal: React.FC<CreateBannerModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    link: "https://example.com/target-page",
    status: "active" as "active" | "inactive",
  });
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Banner title is required";
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        title: formData.title,
        link: formData.link,
        status: formData.status,
      });

      // Reset form
      setFormData({
        title: "",
        link: "https://example.com/target-page",
        status: "active",
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    // Handle file upload logic here
    console.log("Files dropped:", files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Handle file upload logic here
    console.log("Files selected:", files);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Create New Banner
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-purple-600 rounded mr-3 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded"></div>
              </div>
              <h3 className="text-lg font-medium text-white">
                Basic Information
              </h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Banner Title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter banner title"
                error={errors.title}
              />

              <Input
                label="Link (Optional)"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                icon="🔗"
                error={errors.link}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full p-3 bg-gray-800 border border-purple-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Image Upload */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Upload size={24} className="text-white mr-3" />
              <h3 className="text-lg font-medium text-white">Banner Image</h3>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragOver
                  ? "border-purple-600 bg-purple-600 bg-opacity-10"
                  : "border-gray-500 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                <span className="bg-gray-600 px-2 py-1 rounded text-xs mr-2">
                  ⚡
                </span>
                Activate Windows
                <br />
                <span className="text-xs">
                  Go to Settings to activate Windows.
                </span>
              </div>

              <Button
                type="submit"
                disabled={!formData.title.trim()}
                className="flex items-center"
              >
                <div className="w-4 h-4 border-2 border-white rounded mr-2"></div>
                Create Banner
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
