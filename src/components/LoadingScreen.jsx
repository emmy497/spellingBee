// src/components/LoadingScreen.jsx
import { motion } from "framer-motion";
import Bee from "../assets/SpellingBee.png"

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.img
        src={Bee} // Replace this with your actual logo path
        alt="Loading..."
        className="w-[300px]"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default LoadingScreen;
