import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { userToken } = useAppContext(); // get token

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold text-gray-800">
          Photo-Organizer
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {userToken ? (
            <>
              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to="/"
              >
                Home
              </Link>

              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to="/upload"
              >
                Upload
              </Link>

              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to="/slideshow"
              >
                Slideshow
              </Link>

              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to="/profile"
              >
                Profile
              </Link>
            </>
          ) : (
            <Link
              className="text-gray-700 hover:text-black text-sm font-medium"
              to="/auth"
            >
              Login / Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          {userToken ? (
            <>
              <Link
                className="block text-gray-700 text-sm"
                to="/"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>

              <Link
                className="block text-gray-700 text-sm"
                to="/upload"
                onClick={() => setOpen(false)}
              >
                Upload
              </Link>

              <Link
                className="block text-gray-700 text-sm"
                to="/slideshow"
                onClick={() => setOpen(false)}
              >
                Slideshow
              </Link>

              <Link
                className="block text-gray-700 text-sm"
                to="/profile"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
            </>
          ) : (
            <Link
              className="block text-gray-700 text-sm font-medium"
              to="/auth"
              onClick={() => setOpen(false)}
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
