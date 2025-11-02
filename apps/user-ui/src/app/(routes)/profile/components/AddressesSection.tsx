import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Address } from "../types/type";

const AddressesSection = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "Home",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      isDefault: true,
    },
    {
      id: "2",
      type: "Work",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zip: "10002",
      isDefault: false,
    },
  ]);

  return (
    <div className="rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#773d4c]">Saved Addresses</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#773d4c] text-white rounded-2xl hover:opacity-90 transition-opacity">
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#773d4c]">
                    {address.type}
                  </span>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.zip}
                </p>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1 text-[#773d4c] border border-[#773d4c] rounded-2xl hover:bg-[#773d4c] hover:text-white transition-colors text-sm">
                Edit
              </button>
              {!address.isDefault && (
                <button className="px-3 py-1 text-gray-600 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors text-sm">
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AddressesSection;
