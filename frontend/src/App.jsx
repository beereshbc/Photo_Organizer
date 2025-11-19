import React from "react";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Slideshow from "./pages/Slideshow";
import { useAppContext } from "./context/AppContext";
import toast, { Toaster } from "react-hot-toast";
import Upload from "./pages/Upload";

const App = () => {
  const { userToken } = useAppContext();
  return (
    <div>
      <Navbar />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
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
