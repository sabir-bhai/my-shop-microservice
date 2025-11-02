import { useState } from "react";
import { PaymentMethod } from "../types/type";
import { Plus, Trash2 } from "lucide-react";

const PaymentMethodsSection = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "MasterCard",
      last4: "8888",
      expiry: "06/26",
      isDefault: false,
    },
  ]);

  return (
    <div className="rounded-2xl  p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#773d4c]">Payment Methods</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#773d4c] text-white rounded-2xl hover:opacity-90 transition-opacity">
          <Plus size={16} />
          Add New Card
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="border border-gray-200 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#773d4c]">
                    {method.type}
                  </span>
                  {method.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  •••• •••• •••• {method.last4}
                </p>
                <p className="text-xs text-gray-500">Expires {method.expiry}</p>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            {!method.isDefault && (
              <button className="px-3 py-1 text-[#773d4c] border border-[#773d4c] rounded-2xl hover:bg-[#773d4c] hover:text-white transition-colors text-sm">
                Set Default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default PaymentMethodsSection;
