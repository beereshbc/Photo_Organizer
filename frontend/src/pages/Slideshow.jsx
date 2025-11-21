import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { Trash2, Code, X, ChevronLeft, ChevronRight } from "lucide-react";

const Slideshow = () => {
  const [slideshows, setSlideshows] = useState([]);
  const [currentSlideshow, setCurrentSlideshow] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [embedCode, setEmbedCode] = useState("");
  const { axios, userToken } = useAppContext();
  const autoSlideRef = useRef();

  const fetchSlideshows = async () => {
    try {
      const res = await axios.get("/api/images/slideshows", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.data.success) setSlideshows(res.data.slideshows);
    } catch (error) {
      toast.error("Failed to fetch slideshows");
    }
  };

  useEffect(() => {
    fetchSlideshows();
  }, []);

  // Delete slideshow
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
        setSlideshows(slideshows.filter((s) => s._id !== slideshowId));
        if (currentSlideshow?._id === slideshowId) setCurrentSlideshow(null);
      }
    } catch (error) {
      toast.error("Failed to delete slideshow");
    }
  };

  // Embed code generation
  const generateEmbedCode = (slide) => {
    const code = `<div id="slideshow-${slide._id}"></div>\n<script src="https://your-domain.com/embed-slideshow.js" data-slideshow-id="${slide._id}"></script>`;
    setEmbedCode(code);
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  // Slideshow navigation
  const nextSlide = () =>
    currentSlideshow &&
    setCurrentSlideIndex((prev) =>
      prev === currentSlideshow.images.length - 1 ? 0 : prev + 1
    );
  const prevSlide = () =>
    currentSlideshow &&
    setCurrentSlideIndex((prev) =>
      prev === 0 ? currentSlideshow.images.length - 1 : prev - 1
    );
  const closeSlideshow = () => {
    setCurrentSlideshow(null);
    setCurrentSlideIndex(0);
    setEmbedCode("");
    clearInterval(autoSlideRef.current);
  };

  // Auto-scroll slideshow
  useEffect(() => {
    if (currentSlideshow) {
      autoSlideRef.current = setInterval(nextSlide, 3000); // 3s per slide
    }
    return () => clearInterval(autoSlideRef.current);
  }, [currentSlideshow]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Slideshows</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {slideshows.map((slide) => (
          <div
            key={slide._id}
            className="relative border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer bg-white"
          >
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <button
                onClick={() => deleteSlideshowById(slide._id)}
                className="p-1 text-red-500 hover:text-red-700 bg-white rounded-full border border-gray-200 shadow"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => generateEmbedCode(slide)}
                className="p-1 text-blue-500 hover:text-blue-700 bg-white rounded-full border border-gray-200 shadow"
              >
                <Code size={18} />
              </button>
            </div>

            <div
              onClick={() => {
                setCurrentSlideshow(slide);
                setCurrentSlideIndex(0);
              }}
            >
              {slide.images[0] ? (
                <img
                  src={slide.images[0].url}
                  alt={slide.name}
                  className="w-full h-44 object-cover rounded-lg mb-3 border border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-full h-44 flex items-center justify-center bg-gray-100 rounded-lg mb-3 text-gray-400">
                  No Image
                </div>
              )}
              <h4 className="font-semibold text-lg text-gray-800">
                {slide.name}
              </h4>
              <p className="text-sm text-gray-500">
                {slide.imageCount} image{slide.imageCount > 1 && "s"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {currentSlideshow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-4xl w-full">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={closeSlideshow}
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full border border-gray-200 shadow hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full border border-gray-200 shadow hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              {currentSlideshow.name} ({currentSlideshow.imageCount} images)
            </h3>

            <div className="flex items-center justify-center">
              <img
                src={currentSlideshow.images[currentSlideIndex].url}
                alt={`Slide ${currentSlideIndex + 1}`}
                className="max-h-[500px] w-full object-contain rounded-lg border border-gray-200 shadow"
              />
            </div>
            <p className="text-center mt-2 text-gray-500">
              {currentSlideIndex + 1} / {currentSlideshow.images.length}
            </p>

            {/* Embed code */}
            {embedCode && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                <p className="font-semibold mb-1 text-gray-700">Embed Code:</p>
                <textarea
                  readOnly
                  className="w-full h-24 p-2 border border-gray-300 rounded text-gray-700"
                  value={embedCode}
                />
                <button
                  onClick={copyEmbedCode}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Copy Embed Code
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slideshow;
