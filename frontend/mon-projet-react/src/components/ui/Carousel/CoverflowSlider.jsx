import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const CONFIG = {
  VIEWBOX_MAX_WIDTH: 320,
  CONTAINER_TRANSLATE_X_PERCENTAGE_PER_SLIDE: 50,
  ITEM_ROTATE_Y_DEFAULT: 45,
  ITEM_ROTATE_Y_ACTIVE: 0,
  ITEM_SCALE_DEFAULT: 0.75,
  ITEM_SCALE_ACTIVE: 1,
  ITEM_INNER_BEFORE_TRANSLATE_DEFAULT_X: -24,
  ITEM_INNER_BEFORE_TRANSLATE_DEFAULT_Y: 12,
  ITEM_INNER_BEFORE_TRANSLATE_ACTIVE_X: 0,
  ITEM_INNER_BEFORE_TRANSLATE_ACTIVE_Y: 24,
  AUTO_PLAY_INTERVAL: 4000,
  TRANSITION_DURATION: 600,
  EASING: 'cubic-bezier(0.62,0.28,0.23,0.99)',
};

const getRandomPicsumUrl = (width, height, seed = null) => {
  const randomId = seed ?? Math.floor(Math.random() * 1000);
  return `https://picsum.photos/id/${randomId}/${width}/${height}`;
};

const generateSlideData = (count = 7) => {
  const categories = ['Nature', 'Architecture', 'Abstract', 'Portrait', 'Landscape', 'Urban', 'Vintage'];
  const artists = ['Elena Rodriguez', 'Marcus Chen', 'Sofia Andersson', 'David Kim', 'Luna Patel', 'Alex Thompson', 'Maya Williams'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    src: getRandomPicsumUrl(600, 600, i * 50 + 100), 
    alt: `${categories[i % categories.length]} Photography ${i + 1}`,
    title: `${categories[i % categories.length]} Collection ${i + 1}`,
    artist: artists[i % artists.length],
    link: `https://picsum.photos/id/${i * 50 + 100}/1200/800`,
    category: categories[i % categories.length],
  }));
};

function EnhancedCoverflowSlider({ 
  slideCount = 7, 
  autoPlay = true, 
  showControls = true,
  showIndicators = true,
  pauseOnHover = true 
}) {
  const slideData = useMemo(() => generateSlideData(slideCount), [slideCount]);
  const [activeIndex, setActiveIndex] = useState(Math.floor(slideData.length / 2));
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const preloadImages = () => {
      slideData.forEach((slide, index) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
        img.src = slide.src;
      });
    };
    preloadImages();
  }, [slideData]);

  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % slideData.length);
      }, CONFIG.AUTO_PLAY_INTERVAL);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, isHovered, slideData.length]);

  const handleSlideChange = useCallback((index) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, CONFIG.TRANSITION_DURATION);
  }, [activeIndex, isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleSlideChange(activeIndex > 0 ? activeIndex - 1 : slideData.length - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSlideChange((activeIndex + 1) % slideData.length);
          break;
        case ' ':
          e.preventDefault();
          setIsAutoPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, slideData.length, handleSlideChange]);


  const getSliderItemStyle = useCallback((index) => {
    const isActive = index === activeIndex;
    const distance = index - activeIndex;
    
    let transform = '';
    let zIndex = Math.max(1, 10 - Math.abs(distance));
    let opacity = 1;

    if (isActive) {
      transform = `rotateY(${CONFIG.ITEM_ROTATE_Y_ACTIVE}deg) translateZ(0px)`;
      zIndex = 99;
    } else {
      const rotateY = distance < 0 ? CONFIG.ITEM_ROTATE_Y_DEFAULT : -CONFIG.ITEM_ROTATE_Y_DEFAULT;
      const translateZ = -Math.abs(distance) * 20;
      transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      
      if (Math.abs(distance) > 2) {
        opacity = Math.max(0.3, 1 - (Math.abs(distance) - 2) * 0.2);
      }
    }
    
    return {
      transform,
      zIndex,
      opacity,
      filter: isActive ? 'none' : 'blur(0.5px)',
    };
  }, [activeIndex]);

  const getSliderItemInnerStyle = useCallback((index) => {
    const isActive = index === activeIndex;
    const distance = Math.abs(index - activeIndex);
    const scale = isActive ? CONFIG.ITEM_SCALE_ACTIVE : CONFIG.ITEM_SCALE_DEFAULT - (distance * 0.05);
    
    return {
      transform: `scale(${Math.max(scale, 0.5)})`,
    };
  }, [activeIndex]);

  const getSliderItemInnerBeforeStyle = useCallback((index) => {
    const isActive = index === activeIndex;
    const distance = index - activeIndex;
    
    let transformX = CONFIG.ITEM_INNER_BEFORE_TRANSLATE_DEFAULT_X;
    let transformY = CONFIG.ITEM_INNER_BEFORE_TRANSLATE_DEFAULT_Y;

    if (isActive) {
      transformX = CONFIG.ITEM_INNER_BEFORE_TRANSLATE_ACTIVE_X;
      transformY = CONFIG.ITEM_INNER_BEFORE_TRANSLATE_ACTIVE_Y;
    } else if (distance > 0) {
      transformX = -CONFIG.ITEM_INNER_BEFORE_TRANSLATE_DEFAULT_X;
    }
    
    return {
      transform: `translate(${transformX}px, ${transformY}px)`,
      opacity: Math.max(0.3, 1 - Math.abs(distance) * 0.1),
    };
  }, [activeIndex]);

  return (
    <div 
      className="relative w-full h-[600px] mt-[90px] overflow-hidden font-sans bg-[##b2f6ff] flex items-center justify-center"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      tabIndex={0}
      role="region"
      aria-label="Coverflow Image Slider"
    >

      <div className="absolute inset-0 bg-[#b2f6ff] animate-pulse" 
           style={{ animationDuration: '8s' }} />
      
      <div className="relative h-full w-full z-10">
        <div 
          className="block relative mx-auto"
          style={{ 
            width: '33.333333%',
            maxWidth: `${CONFIG.VIEWBOX_MAX_WIDTH}px`,
            perspective: '1200px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="block relative w-full pb-[100%]" />
          
          <div 
            className={`absolute inset-0 w-full h-[600px] mt-[40px] mb-10 transition-transform duration-${CONFIG.TRANSITION_DURATION} ease-[${CONFIG.EASING}] delay-300`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateX(-${activeIndex * CONFIG.CONTAINER_TRANSLATE_X_PERCENTAGE_PER_SLIDE}%)`
            }}
          >
            {slideData.map((slide, index) => (
              <div
                key={slide.id}
                className={`block absolute top-0 w-full h-full mb-10 transition-all duration-${CONFIG.TRANSITION_DURATION} ease-[${CONFIG.EASING}] delay-150`}
                style={{
                  ...getSliderItemStyle(index),
                  left: `${index * CONFIG.CONTAINER_TRANSLATE_X_PERCENTAGE_PER_SLIDE}%`,
                }}
              >
                <div 
                  className={`relative w-full h-full origin-center transition-transform duration-300 ease-[${CONFIG.EASING}] z-10`}
                  style={getSliderItemInnerStyle(index)}
                >
                  <div 
                    className={`absolute top-[24px] left-[24px] bottom-[24px] right-[24px] -z-[1] transition-all duration-300 ease-[${CONFIG.EASING}] delay-150`}
                    style={{
                      ...getSliderItemInnerBeforeStyle(index),
                      boxShadow: index === activeIndex 
                        ? '0 25px 50px rgba(0,0,0,0.4), 0 15px 20px rgba(0,0,0,0.3)' 
                        : '0 10px 20px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  
                  <div
                    className="absolute inset-0 z-[1] bg-repeat-x bg-[length:200%_100%] transition-all duration-300 linear rounded-xl"
                    style={{
                      backgroundImage: index === activeIndex
                        ? 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0) 100%)'
                        : 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
                      backgroundPosition: index === activeIndex ? '-50% 0%' : '0% 0%',
                      transitionDelay: index === activeIndex ? '0.6s' : '0s'
                    }}
                  />

                  <figure className="relative w-full h-full m-0 p-0 overflow-hidden rounded-xl">
                    {!loadedImages.has(index) && (
                      <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                    
                    <img
                      className={`absolute block w-full h-full object-cover inset-0 m-auto z-[1] transition-opacity duration-500 ${
                        loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                      }`}
                      src={slide.src}
                      alt={slide.alt}
                      loading={Math.abs(index - activeIndex) <= 2 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        const newRandomId = Math.floor(Math.random() * 1000);
                        e.target.src = getRandomPicsumUrl(600, 600, newRandomId);
                      }}
                    />

                    <figcaption 
                      className={`absolute block overflow-hidden left-0 right-0 bottom-0 text-white p-6 z-[2] 
                                  bg-gradient-to-t from-black/80 via-black/60 to-transparent
                                  transition-opacity duration-300 ease-[${CONFIG.EASING}] delay-300 backdrop-blur-sm`}
                      style={{
                        opacity: index === activeIndex ? 1 : 0,
                        transitionDelay: index === activeIndex ? '0.75s' : '0s'
                      }}
                    >
                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 text-xs bg-white/20 rounded-full backdrop-blur-sm">
                          {slide.category}
                        </span>
                      </div>
                      <a 
                        href={slide.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block no-underline text-xl leading-tight font-bold text-white hover:text-blue-300 transition-colors duration-200"
                      >
                        {slide.title}
                      </a>
                      <span className="block text-sm leading-tight mt-1 text-gray-300">
                        by {slide.artist}
                      </span>
                    </figcaption>
                  </figure>
                  

                  {index !== activeIndex && (
                    <div
                      className="absolute inset-0 w-full h-full z-[100] cursor-pointer hover:bg-white/5 transition-colors duration-200 rounded-xl"
                      onClick={() => handleSlideChange(index)}
                      title={`View ${slide.title}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSlideChange(index);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slideData.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => handleSlideChange(index)}
              disabled={isTransitioning}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-4 left-4 z-20 text-xs text-white/60 bg-black/20 backdrop-blur-sm rounded px-2 py-1">
        Use ← → keys or spacebar
      </div>
    </div>
  );
}

export default EnhancedCoverflowSlider;