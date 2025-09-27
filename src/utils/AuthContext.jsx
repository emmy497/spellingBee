import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import LoadingScreen from "../components/LoadingScreen";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userId , setUserId] = useState(null)
  const [loading, setLoading] = useState(true); 
  const [loadingScreen, setLoadingScreen] = useState(true); // State for loading screen

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUser(decoded.username);
        console.log(decoded.id)
        setUserId(decoded.id)
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // Mark loading as complete
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingScreen(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);



  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loadingScreen) {
    return <LoadingScreen />; // Show loading screen while checking auth status
  } 

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading , userId}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
