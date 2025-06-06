import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaAngleRight, FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchAndFormatProducts } from '../../utils/fetchProducts';

export default function ShopEssentials() {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
const [categories, setCategories] = useState([]);


      useEffect(() => {
        fetchAndFormatProducts("http://localhost:3000/api/products/categories").then(data => setCategories(data || []));
      }, []);

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
      <div className="relative h-[calc(100%-100px)]">
        <div 
          ref={scrollContainerRef}
          className="flex flex-nowrap overflow-x-auto space-x-4 scrollbar-hide h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div key={category.id} onClick={()=>navigate(category.url)} className="flex-none w-64 md:w-80">
              <div className="relative overflow-hidden mb-2 group cursor-pointer">
                <img 
                
                  src={`http://localhost:3000${category.path}`} 
                  alt={category.alt}
                  className="w-[600px] h-[600px] object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-2xl md:text-3xl font-bold text-center px-4">
                    {category.url}
                  </h3>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-xl font-medium">
                    {category.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}