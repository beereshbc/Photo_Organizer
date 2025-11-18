import React from "react";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Slideshow from "./pages/Slideshow";
import Upload from "./pages/upload";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { userToken } = useAppContext();
  return (
    <div>
      <Navbar />
      <>
        {userToken ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/slideshow" element={<Slideshow />} />
          </Routes>
        ) : (
          <Login />
        )}
      </>
    </div>
  );
};

export default App;
