import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  const sizes = {
    sm: { container: "h-5 w-9", toggle: "h-3 w-3", translate: "translate-x-5" },
    md: {
      container: "h-6 w-11",
      toggle: "h-4 w-4",
      translate: "translate-x-6",
    },
    lg: {
      container: "h-7 w-13",
      toggle: "h-5 w-5",
      translate: "translate-x-7",
    },
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      className={`relative inline-flex ${
        currentSize.container
      } items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-purple-600" : "bg-gray-600"}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`inline-block ${
          currentSize.toggle
        } transform rounded-full bg-white transition-transform ${
          checked ? currentSize.translate : "translate-x-1"
        }`}
      />
    </button>
  );
};
