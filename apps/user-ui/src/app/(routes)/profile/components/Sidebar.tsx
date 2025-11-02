// import {
//   Bell,
//   CreditCard,
//   LogOut,
//   MapPin,
//   MessageCircle,
//   Settings,
//   ShoppingBag,
//   Star,
//   User,
//   X,
// } from "lucide-react";

// const Sidebar = ({
//   activeSection,
//   setActiveSection,
//   isMobileOpen,
//   setIsMobileOpen,
// }: {
//   activeSection: string;
//   setActiveSection: (section: string) => void;
//   isMobileOpen: boolean;
//   setIsMobileOpen: (open: boolean) => void;
// }) => {
//   const navItems = [
//     { id: "profile", label: "Profile", icon: User },
//     { id: "orders", label: "Orders", icon: ShoppingBag },
//     { id: "addresses", label: "Addresses", icon: MapPin },
//     { id: "password", label: "Change Password", icon: Lock },
//     { id: "payment", label: "Payment Methods", icon: CreditCard },
//     { id: "support", label: "Chat/Support", icon: MessageCircle },
//     { id: "notifications", label: "Notifications", icon: Bell },
//     { id: "reviews", label: "Reviews & Ratings", icon: Star },
//     { id: "settings", label: "Settings", icon: Settings },
//     { id: "logout", label: "Logout", icon: LogOut },
//   ];

//   const handleNavClick = (id: string) => {
//     setActiveSection(id);
//     setIsMobileOpen(false);
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//         fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
//         transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0 transition-transform duration-300 ease-in-out
//       `}
//       >
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-bold text-[#773d4c]">Dashboard</h2>
//           <button
//             onClick={() => setIsMobileOpen(false)}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="p-4 space-y-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = activeSection === item.id;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavClick(item.id)}
//                 className={`
//                   w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200
//                   ${
//                     isActive
//                       ? "bg-[#773d4c] text-white shadow-md"
//                       : "text-gray-600 hover:bg-[#773d4c] hover:text-white hover:shadow-md"
//                   }
//                 `}
//               >
//                 {/* <Icon size={20} /> */}
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>
//     </>
//   );
// };
// export default Sidebar;

import {
  Bell,
  CreditCard,
  LogOut,
  MapPin,
  MessageCircle,
  Settings,
  ShoppingBag,
  Star,
  User,
  Lock,
  X,
} from "lucide-react";

const Sidebar = ({
  activeSection,
  setActiveSection,
  isMobileOpen,
  setIsMobileOpen,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}) => {
  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "support", label: "Chat/Support", icon: MessageCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "reviews", label: "Reviews & Ratings", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 w-60 bg-[#ffffff]
          transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          shadow-md lg:shadow-none
        `}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-[#773d4c]">Dashboard</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex items-center w-full gap-3 px-4 py-3 rounded-xl
                  transition-all
                  ${
                    isActive
                      ? "bg-[#773d4c] text-white  shadow-sm"
                      : "text-gray-700 hover:bg-[#e7d9dd] hover:text-[#773d4c]"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
