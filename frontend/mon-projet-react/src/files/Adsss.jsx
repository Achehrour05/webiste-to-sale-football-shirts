import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaAngleRight, FaChevronLeft } from "react-icons/fa6";
export default function ShopEssentials() {
  const scrollContainerRef = useRef(null);
  
  const categories = [
    {
      id: 1,
      name: "Kits",
      image: require("../assets/kt.jpg"),
      alt: "Person wearing a camouflage cap"
    },
    {
      id: 2,
      name: "Shoes",
      image: require("../assets/btt.jpg"),
      alt: "Close-up of Nike shoes with khaki pants"
    },
    {
      id: 3,
      name: "Jackets",
      image: require("../assets/jackets.jpg"),
      alt: "Person wearing an Angels baseball jersey"
    },
    {
      id: 4,
      name: "Balls",
      image: require("../assets/bl.jpg"),
      alt: "Collection of stylish shirts"
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-white mt-0">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[1.1rem] font-semibold uppercase tracking-[0.5px] mt-[2.5rem] mb-[1rem] px-[1.5rem] text-[#333]">Shop the Essentials</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-white-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <FaChevronLeft/>
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-white-100 hover:bg-gray-200 transition-colors flex justify-end"
            aria-label="Scroll right"
          >
            <FaAngleRight/>
          </button>
        </div>
      </div>
      
      <div className="relative h-[calc(100%-100px)]">
        <div 
          ref={scrollContainerRef}
          className="flex flex-nowrap overflow-x-auto space-x-4 scrollbar-hide h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div key={category.id} className="flex-none w-64 md:w-80">
              <div className="overflow-hidden mb-2">
                <img 
                  src={category.image} 
                  alt={category.alt}
                  className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium mt-2">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
