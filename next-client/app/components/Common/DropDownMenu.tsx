// "use client";

// import { useState } from "react";

// type MenuItem = {
//   label: string;
//   onClick: () => void;
//   colorClass?: string; // optional text color class
//   roundedTop?: boolean;
//   roundedBottom?: boolean;
// };

// type DropdownMenuProps = {
//   items: MenuItem[];
// };

// export default function DropdownMenu({ items }: DropdownMenuProps) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-1 rounded-full hover:bg-gray-100 transition"
//       >
//         <svg
//           className="w-6 h-6 text-gray-500"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm4-4a2 2 0 11-4 0 2 2 0 014 0zm0 8a2 2 0 11-4 0 2 2 0 014 0z" />
//         </svg>
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
//           {items.map((item, idx) => (
//             <button
//               key={idx}
//               onClick={() => {
//                 item.onClick();
//                 setOpen(false);
//               }}
//               className={`
//                 block w-full text-left px-4 py-2 font-medium
//                 ${item.colorClass ?? "text-gray-600"}
//                 hover:bg-gray-100
//                 ${item.roundedTop ? "rounded-t-xl" : ""}
//                 ${item.roundedBottom ? "rounded-b-xl" : ""}
//               `}
//             >
//               {item.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";

export type MenuItem = {
  label: string;
  onClick: () => void;
  colorClass?: string; // optional text color class
  roundedTop?: boolean;
  roundedBottom?: boolean;
};

type DropdownMenuProps = {
  items: MenuItem[];
};

export default function DropdownMenu({ items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full hover:bg-gray-100 transition"
      >
        <svg
          className="w-6 h-6 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm4-4a2 2 0 11-4 0 2 2 0 014 0zm0 8a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {/* Menu items */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setOpen(false); // close menu after click
              }}
              className={`
                block w-full text-left px-4 py-2 font-medium
                ${item.colorClass ?? "text-gray-600"}
                hover:bg-gray-100
                ${item.roundedTop ? "rounded-t-xl" : ""}
                ${item.roundedBottom ? "rounded-b-xl" : ""}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
    
  );
}
