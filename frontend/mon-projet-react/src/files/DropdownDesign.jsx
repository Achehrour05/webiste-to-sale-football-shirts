import React from 'react';
import { Link } from 'react-router-dom';
// import { Ball } from 'lucide-react'; // Example icon import

// Placeholder: replace with your actual data structure
const DropdownContentDesign = ({ items = [], shopAll = null, columns = 4 }) => {

    // Dynamically create column class based on prop
    const gridColsClass = `grid-cols-${columns}`; // e.g., 'grid-cols-4'

  return (
    // Container for the dropdown content - style as needed in parent (bg, shadow, padding)
    <div className={`grid ${gridColsClass} gap-x-6 gap-y-2`}>
      {/* Map over the regular items */}
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          // Styling for each link item
          className="group flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 transition-colors duration-150 no-underline"
        >
          {/* Logo */}
          {item.logo && ( // Conditionally render logo if it exists
                <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    // Adjust size to match example - w-5 h-5 is 20px
                    className="w-5 h-5 object-contain flex-shrink-0"
                />
          )}
          {/* Name */}
          <span className="text-sm text-gray-700 group-hover:text-black truncate"> {/* Truncate long names */}
            {item.name}
          </span>
        </Link>
      ))}

      {/* Optional "Shop All" Link */}
      {shopAll && (
        <Link
          key="shop-all"
          to={shopAll.path}
          className="group flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 transition-colors duration-150 font-medium no-underline" // Added font-medium
        >
          {/* Example using simple text icon */}
          {shopAll.icon && (
             <span className="w-5 h-5 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                {shopAll.icon}
                {/* Or using an imported icon component: */}
                {/* <Ball size={18} className="text-gray-500 group-hover:text-black" /> */}
             </span>
          )}
           <span className="text-sm text-gray-700 group-hover:text-black">
            {shopAll.name}
          </span>
        </Link>
      )}
    </div>
  );
};

export default DropdownContentDesign;