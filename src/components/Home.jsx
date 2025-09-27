import React from "react";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { Link } from "react-router-dom";

function Home() {
  const [loadingCreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingScreen(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  if (loadingCreen) return <LoadingScreen />;
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4">
      <Link to="/parent">
        <div className="bg-yellow-500 w-[150px] p-4 font-semibold text-white text-center">Parents Zone</div>
      </Link>
      <Link to="/kids">
        <div className="bg-yellow-500 w-[150px] p-4 font-semibold text-white text-center">Kids Zone</div>
      </Link>
    </div>
  );
}

export default Home;
