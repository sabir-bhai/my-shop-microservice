import { useState } from "react";

const LogoutSection = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Logout logic here
    console.log("User logged out");
    setShowLogoutModal(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#773d4c] mb-6">Logout</h2>

      <div className="max-w-md">
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout from your account? You'll need to sign
          in again to access your dashboard.
        </p>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-medium"
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-[#773d4c] mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LogoutSection;
