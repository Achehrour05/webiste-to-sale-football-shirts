import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

const FootballCarousel = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const categories = [
    {
      id: 1,
      title: "KITS",
      subtitle: "OFFICIAL JERSEYS",
      description: "Authentic team wear",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
      color: "bg-black",
      textColor: "text-white",
      accent: "bg-white",
      items: "150+"
    },
    {
      id: 2,
      title: "BALLS",
      subtitle: "MATCH QUALITY",
      description: "Precision engineered",
      image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=600&fit=crop",
      color: "bg-white",
      textColor: "text-black",
      accent: "bg-black",
      items: "80+"
    },
    {
      id: 3,
      title: "TRAINING",
      subtitle: "PERFORMANCE WEAR",
      description: "Elevate your game",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
      color: "bg-gray-900",
      textColor: "text-white",
      accent: "bg-lime-400",
      items: "120+"
    },
    {
      id: 4,
      title: "BOOTS",
      subtitle: "PRECISION CLEATS",
      description: "Every surface",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
      color: "bg-red-600",
      textColor: "text-white",
      accent: "bg-white",
      items: "200+"
    }
  ];

  const scrollLeft = () => {
    const container = document.getElementById('categories-container');
    container.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('categories-container');
    container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="w-16 h-1 bg-black mb-6"></div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-black mb-4 leading-none">
                SHOP BY CATEGORY
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Premium football equipment designed for peak performance
              </p>
            </div>
            
            <div className="hidden md:flex gap-2">
              <button
                onClick={scrollLeft}
                className="w-12 h-12 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="w-12 h-12 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            id="categories-container"
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`group relative flex-shrink-0 w-80 h-96 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500 ${category.color}`}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >

                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>


                <div className={`absolute top-4 left-6 text-5xl font-black opacity-20 ${category.textColor}`}>
                  0{index + 1}
                </div>

                <div className="absolute top-6 right-6">
                  <div className={`${category.accent} ${category.color === 'bg-white' ? 'text-white' : 'text-black'} px-3 py-1 text-xs font-bold tracking-wider`}>
                    {category.items}
                  </div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <div className={`w-12 h-1 ${category.accent} mb-4 transform origin-left transition-all duration-500 ${
                    hoveredCategory === category.id ? 'scale-x-150' : 'scale-x-100'
                  }`}></div>
                  

                  <p className={`text-xs font-semibold tracking-widest mb-2 ${category.textColor} opacity-80`}>
                    {category.subtitle}
                  </p>
                  
                  <h2 className={`text-2xl md:text-3xl font-black mb-2 leading-none ${category.textColor}`}>
                    {category.title}
                  </h2>
                  
                  <p className={`text-sm mb-6 leading-relaxed ${category.textColor} opacity-90`}>
                    {category.description}
                  </p>
                  
                  <button className={`group/btn ${category.accent} ${category.color === 'bg-white' ? 'text-white' : 'text-black'} px-5 py-3 font-bold text-xs tracking-wider hover:scale-105 transition-all duration-300 flex items-center gap-2 self-start`}>
                    SHOP
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className={`absolute inset-0 transition-all duration-300 ${
                  hoveredCategory === category.id ? 'bg-black bg-opacity-10' : 'bg-transparent'
                }`}></div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {categories.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-300 transition-colors duration-300"
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-black text-white p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              GEAR UP FOR GREATNESS
            </h3>
            <p className="text-lg opacity-80 mb-8">
              Professional equipment trusted by champions worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 font-bold text-sm tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                VIEW ALL PRODUCTS
              </button>
              <button className="border border-white text-white px-8 py-4 font-bold text-sm tracking-wider hover:bg-white hover:text-black transition-colors">
                FIND RETAILERS
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FootballCarousel;