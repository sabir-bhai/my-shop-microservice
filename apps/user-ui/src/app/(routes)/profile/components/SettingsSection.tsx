import { useState } from "react";

const SettingsSection = () => {
  const [settings, setSettings] = useState({
    language: "en",
    timezone: "EST",
    currency: "USD",
    theme: "light",
  });

  const handleSettingChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className=" p-6">
      <h2 className="text-2xl font-bold text-[#773d4c] mb-6">
        Settings & Preferences
      </h2>

      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange("language", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#773d4c] focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Zone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange("timezone", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#773d4c] focus:border-transparent"
          >
            <option value="EST">Eastern Time (EST)</option>
            <option value="CST">Central Time (CST)</option>
            <option value="MST">Mountain Time (MST)</option>
            <option value="PST">Pacific Time (PST)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange("currency", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#773d4c] focus:border-transparent"
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="CAD">Canadian Dollar (CAD)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange("theme", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#773d4c] focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <button className="w-full px-6 py-3 bg-[#773d4c] text-white rounded-2xl hover:opacity-90 transition-opacity font-medium">
          Save Settings
        </button>
      </div>
    </div>
  );
};
export default SettingsSection;
