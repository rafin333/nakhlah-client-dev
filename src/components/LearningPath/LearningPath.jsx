import React from "react";
import Image from "next/image";

// Replace with your actual image import paths or URLs
const iconStart = "/path-to-start-icon.png";
const iconLock = "/path-to-lock-icon.png";
const iconBird = "/path-to-bird-icon.png";

const LearningPathScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full p-4 bg-green-500 text-white flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Unit 1</h2>
          <p>Pair letters and sounds, identify names</p>
        </div>
        <button className="bg-white text-green-500 px-3 py-1 rounded-full font-semibold">
          GUIDEBOOK
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <Image src={iconStart} alt="Start" width={60} height={60} />
        </div>
        {/* Repeat similar blocks for other icons */}
        <div className="mb-4 opacity-50">
          <Image src={iconLock} alt="Locked" width={60} height={60} />
        </div>
        <div className="mb-4 opacity-50">
          <Image src={iconBird} alt="Bird" width={60} height={60} />
        </div>
        {/* ... */}
      </div>
      <div className="w-full p-4 bg-purple-500 text-white flex justify-between items-center mt-4">
        <div>
          <h2 className="text-xl font-bold">Unit 2</h2>
          <p>Refer to places, talk about your house</p>
        </div>
        <button className="bg-white text-purple-500 px-3 py-1 rounded-full font-semibold">
          GUIDEBOOK
        </button>
      </div>
      {/* ... Add navigation buttons ... */}
    </div>
  );
};

export default LearningPathScreen;
