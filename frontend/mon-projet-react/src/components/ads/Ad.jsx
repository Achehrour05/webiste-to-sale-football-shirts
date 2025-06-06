import React from 'react';

export default function MembershipBanner() {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;
    const delay = `${Math.random() * 5}s`;
    const duration = `${5 + Math.random() * 10}s`;
    const size = `${2 + Math.random() * 6}px`;
    const opacity = 0.2 + Math.random() * 0.8;
    const sway = 50 + Math.random() * 100;
    
    return (
      <div 
        key={`snow-${i}`}
        className="absolute top-0 bg-white rounded-full pointer-events-none"
        style={{
          left,
          width: size,
          height: size,
          opacity,
          animation: `snowfall ${duration} ${delay} linear infinite`,
          transform: `translateX(${sway}px)`,
        }}
      />
    );
  });

  // Generate winter sparkles (like ice crystals)
  const iceSparkles = Array.from({ length: 20 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;
    const delay = `${Math.random() * 3}s`;
    const size = `${1 + Math.random() * 3}px`;
    const opacity = 0.2 + Math.random() * 0.5;
    
    return (
      <div 
        key={`ice-${i}`}
        className="absolute bg-blue-100 rounded-full pointer-events-none"
        style={{
          left,
          top,
          width: size,
          height: size,
          opacity,
          animation: `sparkle 2s ${delay} infinite alternate`,
          boxShadow: '0 0 8px 2px rgba(200, 230, 255, 0.8)',
        }}
      />
    );
  });

  return (
    <div className="w-full mt-[50px] bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 py-6 px-4 flex items-center justify-center relative overflow-hidden shadow-lg border border-blue-200">
      <style jsx>{`
        @keyframes snowfall {
          0% { 
            transform: translateY(-100px) translateX(0); 
          }
          50% {
            transform: translateY(50vh) translateX(50px);
          }
          100% { 
            transform: translateY(100vh) translateX(0); 
          }
        }
        @keyframes sparkle {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0.8; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px 0px rgba(100, 150, 255, 0.3); }
          50% { box-shadow: 0 0 20px 5px rgba(100, 150, 255, 0.6); }
          100% { box-shadow: 0 0 10px 0px rgba(100, 150, 255, 0.3); }
        }
      `}</style>
      
      <div className="absolute inset-0 overflow-hidden">
        {snowflakes}
      </div>
      
      {iceSparkles}
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 -skew-x-12 animate-pulse"></div>
      
      <div className="absolute top-2 left-10 w-2 h-2 bg-blue-100 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute bottom-3 right-20 w-1 h-1 bg-blue-200 rounded-full animate-ping opacity-50"></div>
      <div className="absolute top-4 right-32 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-40"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 max-w-4xl w-full justify-center relative z-10">
        <div className="text-blue-900 font-bold text-lg md:text-xl lg:text-2xl tracking-wide animate-float hover:scale-105 transition-transform duration-300 drop-shadow-sm text-center md:text-left">
          DEVIENS MEMBRE ET PROFITE DE 
          <span className="text-blue-600 animate-bounce inline-block ml-2 drop-shadow-md">-10%</span>
          <div className="text-sm font-normal mt-1 text-blue-800">+ avantages exclusifs pour les membres</div>
        </div>
        
        <button className="bg-blue-700 text-white flex justify-center items-center w-[320px] h-[50px] px-6 py-3 font-semibold text-sm uppercase tracking-wide hover:bg-blue-800 hover:scale-110 transition-all duration-300 whitespace-nowrap shadow-xl hover:shadow-2xl transform hover:translate-y-0.5 relative group overflow-hidden animate-pulseGlow">
            S'INSCRIRE GRATUITEMENT
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ❄️
            </span>
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 animate-pulse"></div>
      
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={`burst-${i}`}
            className="absolute w-2 h-2 rounded-full bg-white"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              opacity: 0,
              animation: `snowfall ${1 + Math.random() * 2}s ${i * 0.03}s forwards`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>
      
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-200 opacity-50"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-200 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-200 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-200 opacity-50"></div>
    </div>
  );
}