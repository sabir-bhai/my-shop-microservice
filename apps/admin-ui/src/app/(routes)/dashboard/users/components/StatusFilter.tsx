// "use client";

// interface Props {
//   activeFilter: string;
//   setActiveFilter: (value: string) => void;
// }

// function StatusFilter({ activeFilter, setActiveFilter }: Props) {
//   const buttons = ["All", "Active", "Inactive"];

//   return (
//     <div className="flex gap-2">
//       {buttons.map((label) => (
//         <button
//           key={label}
//           onClick={() => setActiveFilter(label)}
//           className={`px-4 py-1 rounded-full text-sm ${
//             activeFilter === label
//               ? "bg-purple-600 text-white"
//               : "bg-[#1d1d1f] text-white/70"
//           }`}
//         >
//           {label}
//         </button>
//       ))}
//     </div>
//   );
// }
// export default StatusFilter;

"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

function StatusFilter({ activeFilter, setActiveFilter }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buttons = ["All", "Active", "Inactive"];

  const handleClick = (status: string) => {
    setActiveFilter(status);

    // convert status label to lowercase for URL
    const statusForURL = status.toLowerCase();

    const params = new URLSearchParams(searchParams.toString());
    params.set("status", statusForURL);

    router.replace(`/dashboard/users?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {buttons.map((label) => (
        <button
          key={label}
          onClick={() => handleClick(label)}
          className={`px-4 py-1 rounded-full text-sm ${
            activeFilter === label
              ? "bg-[#0085ff] text-white"
              : "bg-[#1d1d1f] text-white/70"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default StatusFilter;
