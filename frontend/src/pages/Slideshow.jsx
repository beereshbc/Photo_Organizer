import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { Trash2, Code, X, ChevronLeft, ChevronRight, Copy } from "lucide-react";

const Slideshow = () => {
  const [slideshows, setSlideshows] = useState([]);
  const [currentSlideshow, setCurrentSlideshow] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [embedCode, setEmbedCode] = useState("");
  const { axios, userToken } = useAppContext();

  // Fetch all slideshows
  const fetchSlideshows = async () => {
    try {
      const res = await axios.get("/api/images/slideshows", {
        headers: { token: userToken },
      });
      if (res.data.success) setSlideshows(res.data.slideshows);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch slideshows");
    }
  };

  useEffect(() => {
    fetchSlideshows();
  }, []);

  // Delete slideshow
  const deleteSlideshowById = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slideshow?"))
      return;
    try {
      const res = await axios.delete(`/api/images/slideshows/${id}`, {
        headers: { token: userToken },
      });
      if (res.data.success) {
        toast.success("Slideshow deleted!");
        setSlideshows(slideshows.filter((s) => s._id !== id));
        if (currentSlideshow?._id === id) setCurrentSlideshow(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete slideshow");
    }
  };

  // Fetch embed code from backend
  const fetchEmbedCode = async (id) => {
    try {
      const res = await axios.get(`/api/images/slideshows/${id}/embed`);
      if (res.data.success) {
        setEmbedCode(res.data.embedScript);
        toast.success("Embed code ready!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch embed code");
    }
  };

  const copyEmbedCode = () => {
    if (embedCode) {
      navigator.clipboard.writeText(embedCode);
      toast.success("Embed code copied!");
    }
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
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Slideshows</h2>

      {/* Slideshows grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {slideshows.map((slide) => (
          <div
            key={slide._id}
            className="relative border rounded-lg shadow hover:shadow-lg transition p-4"
          >
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                onClick={() => fetchEmbedCode(slide._id)}
                title="Embed"
                className="text-blue-500 hover:text-blue-700"
              >
                <Code size={20} />
              </button>
              <button
                onClick={() => deleteSlideshowById(slide._id)}
                title="Delete"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div
              onClick={() => {
                setCurrentSlideshow(slide);
                setCurrentSlideIndex(0);
              }}
              className="cursor-pointer"
            >
              {slide.images[0] ? (
                <img
                  src={slide.images[0].url}
                  alt={slide.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md mb-2">
                  No Image
                </div>
              )}
              <h4 className="font-semibold text-lg">{slide.name}</h4>
              <p className="text-sm text-gray-500">
                {slide.imageCount} image{slide.imageCount > 1 && "s"}
              </p>
              {slide.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {slide.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slideshow modal */}
      {currentSlideshow && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full">
            <button
              onClick={closeSlideshow}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <div className="absolute top-2 left-2 flex gap-2">
              <button
                onClick={() => fetchEmbedCode(currentSlideshow._id)}
                className="text-blue-500 hover:text-blue-700"
                title="Embed"
              >
                <Code size={20} />
              </button>
              <button
                onClick={() => deleteSlideshowById(currentSlideshow._id)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <h3 className="text-2xl font-semibold mb-4">
              {currentSlideshow.name} ({currentSlideshow.imageCount} images)
            </h3>

            <div className="flex items-center justify-center">
              <button
                onClick={prevSlide}
                className="px-4 py-2 bg-gray-200 rounded-l hover:bg-gray-300"
              >
                <ChevronLeft size={20} />
              </button>
              <img
                src={currentSlideshow.images[currentSlideIndex].url}
                alt={`Slide ${currentSlideIndex + 1}`}
                className="max-h-96 mx-4 object-contain"
              />
              <button
                onClick={nextSlide}
                className="px-4 py-2 bg-gray-200 rounded-r hover:bg-gray-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <p className="text-center mt-2 text-gray-600">
              {currentSlideIndex + 1} / {currentSlideshow.images.length}
            </p>

            {/* Embed code */}
            {embedCode && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <p className="font-semibold mb-1">Embed Code:</p>
                <textarea
                  readOnly
                  className="w-full h-24 p-2 border rounded"
                  value={embedCode}
                />
                <button
                  onClick={copyEmbedCode}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <Copy size={16} /> Copy Embed Code
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
