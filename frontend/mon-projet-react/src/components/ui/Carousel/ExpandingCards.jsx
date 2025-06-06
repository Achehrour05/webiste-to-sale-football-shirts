import React from 'react';

const TeamCards = () => {
  const teamMembers = [
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

  const getRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/id/${randomId}/500/500`;
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[##fcffd3] font-['Ubuntu_Mono'] font-normal">
      <div className="w-full flex justify-center h-[500px] gap-2.5 px-5">
        {teamMembers.map((member, index) => (
          <div 
            key={index}
            className="flex-[0_0_120px] rounded-lg transition-all duration-500 ease-in-out cursor-pointer shadow-[1px_5px_15px_#1e0e3e] relative overflow-hidden hover:flex-[0_0_250px] hover:shadow-[1px_3px_15px_#7645d8] hover:-translate-y-[30px]"
            style={{ 
              backgroundImage: `url(${member.image || getRandomImage()})`,
              backgroundPosition: '50%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="text-[1.5rem] text-white flex items-center p-4 opacity-0 flex-col h-full justify-end bg-gradient-to-t from-[rgba(2,2,46,0.68)] to-transparent translate-y-full invisible hover:opacity-100 hover:translate-y-0 hover:visible transition-all duration-500 ease-in-out [transition-delay:0.2s]">
              <h2 className="text-2xl font-medium">{member.name}</h2>
              <span className="block mt-1 text-[1.2rem]">{member.position}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCards;