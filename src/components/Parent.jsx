import React from "react";
import { useAuth } from "../utils/AuthContext";

function Parent() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // remove token and reset auth state
    navigate("/signin"); // redirect to sign in page
  };

  return (
    <>
      <div>Hello, {user}</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Logout
      </button>
    </>
  );
}

export default Parent;
