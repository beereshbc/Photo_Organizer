// pages/Slideshow.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import {
  Trash2,
  Code,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2, // Import Loader2 icon for loading state
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Slideshow = () => {
  const [slideshows, setSlideshows] = useState([]);
  const [currentSlideshow, setCurrentSlideshow] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [embedCode, setEmbedCode] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const { axios, userToken } = useAppContext();
  const autoSlideRef = useRef();

  // Optimized for useCallback
  const fetchSlideshows = useCallback(async () => {
    setIsLoading(true); // Set loading true before fetch
    try {
      const res = await axios.get("/api/images/slideshows", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.data.success) setSlideshows(res.data.slideshows);
    } catch (error) {
      toast.error("Failed to fetch slideshows");
    } finally {
      setIsLoading(false); // Set loading false after fetch completes
    }
  }, [axios, userToken]);

  useEffect(() => {
    fetchSlideshows();
  }, [fetchSlideshows]);

  // Delete slideshow (Logic remains correct)
  const deleteSlideshowById = async (slideshowId) => {
    if (!window.confirm("Are you sure you want to delete this slideshow?"))
      return;
    try {
      const res = await axios.delete(`/api/images/slideshows/${slideshowId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.data.success) {
        toast.success("Slideshow deleted successfully!");
        setSlideshows((prev) => prev.filter((s) => s._id !== slideshowId));
        if (currentSlideshow?._id === slideshowId) setCurrentSlideshow(null);
      }
    } catch (error) {
      toast.error("Failed to delete slideshow");
    }
  };

  // Embed code generation/copy (Logic remains correct)
  const generateEmbedCode = (slide) => {
    const code = `<div id="slideshow-${slide._id}"></div>\n<script src="https://your-domain.com/embed-slideshow.js" data-slideshow-id="${slide._id}"></script>`;
    setEmbedCode(code);
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  // Slideshow navigation: NOW HANDLES DIRECTION
  const nextSlide = useCallback(() => {
    if (!currentSlideshow) return;
    setDirection(1); // Moving forward
    setCurrentSlideIndex((prev) =>
      prev === currentSlideshow.images.length - 1 ? 0 : prev + 1
    );
  }, [currentSlideshow]);

  const prevSlide = useCallback(() => {
    if (!currentSlideshow) return;
    setDirection(-1); // Moving backward
    setCurrentSlideIndex((prev) =>
      prev === 0 ? currentSlideshow.images.length - 1 : prev - 1
    );
  }, [currentSlideshow]);

  const closeSlideshow = () => {
    setCurrentSlideshow(null);
    setCurrentSlideIndex(0);
    setEmbedCode("");
    setDirection(0); // Reset direction
    clearInterval(autoSlideRef.current);
  };

  // Auto-scroll slideshow (Logic remains correct)
  useEffect(() => {
    if (currentSlideshow) {
      // Clear existing interval before setting a new one
      clearInterval(autoSlideRef.current);
      // Ensure auto-scroll uses nextSlide to trigger direction update (1)
      autoSlideRef.current = setInterval(() => {
        setDirection(1);
        nextSlide();
      }, 3000);
    }
    // Cleanup function: Clear interval on unmount or when currentSlideshow changes
    return () => clearInterval(autoSlideRef.current);
  }, [currentSlideshow, nextSlide]);

  // Framer Motion Variants (No changes needed here, as the logic is in place)
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    hover: {
      scale: 1.03,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Directional Slide Variant (Custom prop "direction" is now used)
  const slideImageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%", // Slide from right (1) or left (-1)
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%", // Exit to right (1) or left (-1)
      opacity: 0,
    }),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-700 border-b pb-2 border-gray-100">
        Your Slideshows
      </h2>

      {/* --- New Loading State Display --- */}
      {isLoading ? (
        <div className="flex justify-center items-center mt-20 p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 text-gray-600 bg-white p-4 rounded-lg shadow-md"
          >
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-xl font-semibold">Loading your slideshows...</p>
          </motion.div>
        </div>
      ) : slideshows.length === 0 ? (
        <p className="text-center text-lg text-gray-500 mt-10">
          You haven't created any slideshows yet.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          <AnimatePresence>
            {slideshows.map((slide) => (
              <motion.div
                key={slide._id}
                className="relative border border-gray-100 rounded-xl shadow-lg transition p-4 cursor-pointer bg-white group"
                variants={cardVariants}
                layout // Enable smooth layout transitions for deletions
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentSlideshow(slide);
                  setCurrentSlideIndex(0);
                  setDirection(1); // Set initial direction for the first slide transition animation
                }}
              >
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlideshowById(slide._id);
                    }}
                    className="p-1.5 text-red-600 hover:text-white bg-white hover:bg-red-500 rounded-full border border-gray-200 shadow-md transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateEmbedCode(slide);
                    }}
                    className="p-1.5 text-gray-600 hover:text-white bg-white hover:bg-gray-500 rounded-full border border-gray-200 shadow-md transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Code size={18} />
                  </motion.button>
                </div>

                {slide.images[0] ? (
                  <img
                    src={slide.images[0].url}
                    alt={slide.name}
                    className="w-full h-44 object-cover rounded-lg mb-4 border border-gray-100 shadow-inner"
                  />
                ) : (
                  <div className="w-full h-44 flex flex-col items-center justify-center bg-gray-100 rounded-lg mb-4 text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <p>No Images</p>
                  </div>
                )}
                <h4 className="font-bold text-xl text-gray-900 truncate">
                  {slide.name}
                </h4>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {slide.images.length} image{slide.images.length !== 1 && "s"}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Slideshow Modal Viewer */}
      <AnimatePresence>
        {currentSlideshow && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-600 z-10 p-2 bg-white rounded-full shadow-md"
                onClick={closeSlideshow}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <h3 className="text-3xl font-bold mb-4 text-gray-700 border-b pb-2">
                {currentSlideshow.name}
              </h3>

              <div className="relative flex items-center justify-center overflow-hidden">
                {/* Image and Navigation */}
                {/* Ensure currentSlideshow.images[currentSlideIndex] exists before rendering */}
                {currentSlideshow.images.length > 0 && (
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                      key={currentSlideIndex}
                      src={currentSlideshow.images[currentSlideIndex].url}
                      alt={`Slide ${currentSlideIndex + 1}`}
                      className="max-h-[500px] w-full object-contain rounded-lg border border-gray-200 shadow-lg"
                      variants={slideImageVariants}
                      custom={direction} // Pass the direction to the variants
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                    />
                  </AnimatePresence>
                )}

                {/* Navigation buttons */}
                {currentSlideshow.images.length > 1 && ( // Only show buttons if more than one image
                  <>
                    <motion.button
                      onClick={prevSlide}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-white text-gray-600 p-3 rounded-full border border-gray-200 shadow-xl hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft size={24} />
                    </motion.button>
                    <motion.button
                      onClick={nextSlide}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-white text-gray-600 p-3 rounded-full border border-gray-200 shadow-xl hover:bg-gray-500 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight size={24} />
                    </motion.button>
                  </>
                )}
              </div>

              {currentSlideshow.images.length > 0 && (
                <p className="text-center mt-3 text-lg text-gray-600 font-medium">
                  {currentSlideIndex + 1} / {currentSlideshow.images.length}
                </p>
              )}

              {/* Embed code section */}
              {embedCode && (
                <motion.div
                  className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-bold mb-2 text-gray-700 flex items-center">
                    <Code size={20} className="mr-2" /> Embed Code for External
                    Use:
                  </p>
                  <textarea
                    readOnly
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg text-gray-800 resize-none font-mono text-sm focus:ring-gray-500 focus:border-gray-500"
                    value={embedCode}
                  />
                  <motion.button
                    onClick={copyEmbedCode}
                    className="mt-3 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Copy Embed Code
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Slideshow;
