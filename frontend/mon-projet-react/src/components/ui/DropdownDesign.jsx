import React from 'react';
import { Link } from 'react-router-dom';

const DropdownContentDesign = ({ 
  items = [], 
  shopAll = null, 
  columns = 4,
  onItemClick = () => {} 
}) => {
    const gridColsClass = `grid-cols-${columns}`; 

    const handleLinkClick = (e) => {
        onItemClick(); 
    };

    return (
        <div className={`${gridColsClass} grid gap-2`}>
            
            {items.map((item) => (
                <Link
                    key={item.id}
                    to={item.path}
                    className="group flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 transition-colors duration-150 no-underline"
                    onClick={handleLinkClick} 
                >
                    {item.logo && ( 
                        <img
                            src={item.logo}
                            alt={`${item.name} logo`}
                            className="w-5 h-5 object-contain flex-shrink-0"
                        />
                    )}
                    <span className="text-sm text-gray-700 group-hover:text-black truncate">
                        {item.name}
                    </span>
                </Link>
            ))}
            {shopAll && (
                <Link
                    key="shop-all"
                    to={shopAll.path}
                    className="group flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 transition-colors duration-150 font-medium no-underline"
                    onClick={handleLinkClick}
                >
                    {shopAll.icon && (
                        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            {shopAll.icon}
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