/*import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FootballCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: "KITS",
      subtitle: "OFFICIAL JERSEYS",
      description: "Authentic team wear for champions",
      image: require('../assets/cr7.jpg'),
      color: "bg-black",
      textColor: "text-white",
      accent: "bg-white",
      path:'/Kits'
    },
    {
      id: 2,
      title: "BOOTS",
      subtitle: "PRECISION CLEATS",
      description: "Engineered for every playing surface",
      image: require('../assets/carousel1.png'),
      color: "bg-red-600",
      textColor: "text-white",
      accent: "bg-white",
      path:'/Boots'
    },
    {
      id: 3,
      title: "BALLS",
      subtitle: "MATCH QUALITY",
      description: "Precision engineered for performance",
      image: require('../assets/carousel2.png'),
      color: "bg-white",
      textColor: "text-black",
      accent: "bg-black",
      path:'/Balls'
    },
    {
      id: 4,
      title: "JACKETS",
      subtitle: "PERFORMANCE WEAR",
      description: "Elevate your game every session",
      image: require('../assets/carousel3.png'),
      color: "bg-gray-900",
      textColor: "text-white",
      accent: "bg-lime-400",
      path:'/Jackets'
    },

  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, categories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };
 const goTo = (path) => {
  navigate(path);
};


  return (
    <div className="relative w-full h-screen max-h-[700px] overflow-hidden mt-[60px]">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={`absolute inset-0 transition-transform duration-1000 ease-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0  bg-opacity-40"></div>
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="px-8 md:px-16 lg:px-20 py-12 max-w-4xl">
              <div className="text-8xl md:text-9xl font-black opacity-20 absolute top-0 left-8 md:left-16 lg:left-20 text-white">
              </div>
              
              <div className="relative z-10 max-w-lg">
                <div className={`w-12 h-1 ${category.accent} mb-8`}></div>
                
                <p className="text-sm font-semibold tracking-widest mb-2 text-white opacity-90">
                  {category.subtitle}
                </p>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none text-white">
                  {category.title}
                </h1>
                
                <p className="text-lg md:text-xl mb-12 leading-relaxed text-white opacity-90 max-w-md">
                  {category.description}
                </p>
                
                <button onClick={()=>goTo(category.path)} className={`group ${category.accent} ${category.accent === 'bg-white' ? 'text-black' : 'text-white'} px-8 py-4 font-bold text-sm tracking-wider hover:scale-105 transition-all duration-300 flex items-center gap-3`}>
                  SHOP NOW
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-8 md:left-16 lg:left-20 z-30 flex items-center gap-6">
        <div className="flex gap-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-150'
                  : 'bg-white bg-opacity-40 hover:bg-opacity-70'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>


      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
        <div 
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / categories.length) * 100}%` }}
        />
      </div>

    </div>
  );
};

export default FootballCarousel;
*/