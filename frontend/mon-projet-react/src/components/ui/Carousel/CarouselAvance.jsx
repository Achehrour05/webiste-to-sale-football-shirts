import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAndFormatProducts } from '../../../utils/fetchProducts';
const AthleticCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

const navigate = useNavigate();
  const [carousel, setCarousel] = useState([]);
    const [images, setImages] = useState([]);

      useEffect(() => {
        fetchAndFormatProducts("http://localhost:3000/api/products/carouselimages").then(data => setCarousel(data || []));
        fetchAndFormatProducts("http://localhost:3000/api/products/bottomimages").then(data => setImages(data || []));
      }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carousel.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carousel.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carousel.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carousel.length) % carousel.length);
  };

  return (
    <div className="w-full text-white bg-white">
      <div className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out bg-white"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carousel.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative ">
             <img
             src={`http://localhost:3000${image.path}`}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {console.log(image.paht)}
              <div className="absolute inset-0" />
            <div className="absolute inset-0 flex items-end justify-center mb-[50px]">
              <div className="text-center px-4">
                <h1 className="text-4xl md:text-4xl h-[20px] font-black text-white mb-4 tracking-wider drop-shadow-lg">
                  {image.title}
                </h1>
                <p className="text-[15px] md:text-1xl mb-2 text-white">
                  {image.description}
                </p>
                <button onClick={() => navigate(image.url)} className="bg-white w-[70px] text-black text-[910x] rounded-full  text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Shop
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {carousel.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-8 bg-white-900">
        {images.map((image, index) => (
          <div key={index} className="group relative h-64 md:h-80 overflow-hidden rounded-lg">
            <img
              src={`http://localhost:3000${image.path}`}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 " />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-xl font-bold">{image.title}</h3>
              <p className="text-sm opacity-80 text-white">{image.description}</p>
              <button onClick={() => navigate(image.url)} className="mt-2 bg-white text-black px-4 py-1.5 text-sm font-medium hover:bg-gray-200 transition-colors">
                Voir plus
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>

  );
};

export default AthleticCarousel;
