import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [userToken, setUserToken] = useState(
    localStorage.getItem("userToken") || ""
  );

  const value = {
    axios,
    navigate,
    userToken,
    setUserToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
