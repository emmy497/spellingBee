import React from "react";

const HexagonCard = ({ word }) => {
  return (
  <div className="bg-custom bg-cover bg-center h-screen relative w-full">
         <div className="flex justify-center items-center min-h-screen shadow-xl">
        <div className="relative w-[80%] md:w-[550px] h-[400px] flex flex-col items-center">
          <div className="w-full h-full clip-hexagon bg-yellow-500 text-white flex flex-col justify-between p-6 shadow-2xl">
            <div className="text-2xl font-bold text-center">{word}</div>

            <div className="flex justify-center space-around ">
              <button className="bg-white text-gray-500 cursor-pointer font-semibold px-4 py-2 rounded hover:bg-gray-100 transition">
                Listen
              </button>
              <button className="bg-white text-gray-500 cursor-pointer font-semibold ml-4 px-4 py-2  rounded hover:bg-gray-100 transition">
                Meaning
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HexagonCard;
