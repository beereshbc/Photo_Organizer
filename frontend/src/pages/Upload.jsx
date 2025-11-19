import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  UploadCloud,
  X,
  Loader2,
  Plus,
  Search,
  Filter,
  CheckSquare,
  Square,
  Tags,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const Upload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [userImages, setUserImages] = useState([]);
  const [tagInputs, setTagInputs] = useState({});
  const [uploading, setUploading] = useState(false);
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    tags: [],
    dateFrom: "",
    dateTo: "",
  });

  const { axios, userToken } = useAppContext();

  // ---------------------------
  // Fetch User Images
  // ---------------------------
  const fetchUserImages = async () => {
    try {
      const res = await axios.get("/api/images", {
        headers: { token: userToken },
      });

      if (res.data.success) {
        setUserImages(res.data.images);
        setFilteredImages(res.data.images);
      }
    } catch (error) {
      toast.error("Failed to load images");
    }
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  // ---------------------------
  // Select Images for Upload
  // ---------------------------
  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9), // Temporary ID for preview
    }));
    setSelectedImages(files);
  };

  // ---------------------------
  // Upload
  // ---------------------------
  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error("No images selected");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      selectedImages.forEach((img) => formData.append("images", img.file));

      const res = await axios.post("/api/images/upload", formData, {
        headers: { token: userToken },
      });

      if (res.data.success) {
        toast.success("Uploaded Successfully");
        setSelectedImages([]);
        fetchUserImages();
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------
  // Image Selection for Bulk Operations
  // ---------------------------
  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImageIds);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImageIds(newSelected);
  };

  const selectAllImages = () => {
    if (selectedImageIds.size === filteredImages.length) {
      setSelectedImageIds(new Set());
    } else {
      setSelectedImageIds(new Set(filteredImages.map((img) => img._id)));
    }
  };

  // ---------------------------
  // Bulk Tag Operations
  // ---------------------------
  const handleBulkAddTag = async () => {
    if (selectedImageIds.size === 0) {
      toast.error("No images selected");
      return;
    }

    if (!bulkTagInput.trim()) {
      toast.error("Tag cannot be empty");
      return;
    }

    try {
      const promises = Array.from(selectedImageIds).map((imageId) =>
        axios.post(
          `/api/images/${imageId}/tags`,
          { tag: bulkTagInput.trim() },
          { headers: { token: userToken } }
        )
      );

      await Promise.all(promises);
      toast.success(`Tag added to ${selectedImageIds.size} images`);
      setBulkTagInput("");
      setSelectedImageIds(new Set());
      fetchUserImages();
    } catch {
      toast.error("Failed to add tags to some images");
    }
  };

  const handleBulkRemoveTag = async (tag) => {
    if (selectedImageIds.size === 0) {
      toast.error("No images selected");
      return;
    }

    try {
      const promises = Array.from(selectedImageIds).map((imageId) =>
        axios.delete(`/api/images/${imageId}/tags`, {
          headers: { token: userToken },
          data: { tag },
        })
      );

      await Promise.all(promises);
      toast.success(`Tag removed from ${selectedImageIds.size} images`);
      setSelectedImageIds(new Set());
      fetchUserImages();
    } catch {
      toast.error("Failed to remove tags from some images");
    }
  };

  // ---------------------------
  // Individual Tag Operations
  // ---------------------------
  const handleAddTag = async (imgId) => {
    const tag = tagInputs[imgId];

    if (!tag || !tag.trim()) {
      toast.error("Tag cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `/api/images/${imgId}/tags`,
        { tag },
        { headers: { token: userToken } }
      );

      if (res.data.success) {
        toast.success("Tag Added");
        setTagInputs({ ...tagInputs, [imgId]: "" });
        fetchUserImages();
      }
    } catch {
      toast.error("Failed to add tag");
    }
  };

  const handleRemoveTag = async (imgId, tag) => {
    try {
      const res = await axios.delete(`/api/images/${imgId}/tags`, {
        headers: { token: userToken },
        data: { tag },
      });

      if (res.data.success) {
        toast.success("Tag Removed");
        fetchUserImages();
      }
    } catch {
      toast.error("Failed to remove tag");
    }
  };

  // ---------------------------
  // Search and Filter
  // ---------------------------
  useEffect(() => {
    let results = userImages;

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (img) =>
          img.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          img.filename?.toLowerCase().includes(query) ||
          img._id.includes(query)
      );
    }

    // Date filter
    if (filters.dateFrom) {
      results = results.filter(
        (img) => new Date(img.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      results = results.filter(
        (img) =>
          new Date(img.createdAt) <= new Date(filters.dateTo + "T23:59:59")
      );
    }

    setFilteredImages(results);
  }, [searchQuery, filters, userImages]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      tags: [],
      dateFrom: "",
      dateTo: "",
    });
  };

  // ---------------------------
  // Animation Variants
  // ---------------------------
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-6">
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Image Manager
      </motion.h1>

      {/* Upload Section */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UploadCloud className="text-blue-500" size={24} />
          Upload Images
        </h2>

        {/* Select Images */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center hover:border-blue-400 transition-colors">
          <label className="cursor-pointer flex flex-col items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <UploadCloud size={60} className="text-gray-400 mb-2" />
            </motion.div>
            <span className="text-gray-600 text-lg mb-1">
              Click to select images
            </span>
            <span className="text-gray-400 text-sm">
              Supports multiple selection
            </span>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleSelectImages}
            />
          </label>

          {/* Preview */}
          <AnimatePresence>
            {selectedImages.length > 0 && (
              <motion.div
                className="mt-6 w-full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="font-medium mb-3">
                  Selected Images ({selectedImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {selectedImages.map((img, index) => (
                    <motion.div
                      key={img.id}
                      className="relative border p-2 rounded-lg shadow-sm bg-white"
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <img
                        src={img.preview}
                        alt="preview"
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => {
                          setSelectedImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          URL.revokeObjectURL(img.preview);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Btn */}
          <motion.button
            onClick={handleUpload}
            disabled={uploading || selectedImages.length === 0}
            className={`mt-6 px-8 py-3 rounded-xl flex items-center gap-2 font-medium ${
              uploading || selectedImages.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
            whileHover={
              !uploading && selectedImages.length > 0 ? { scale: 1.05 } : {}
            }
            whileTap={
              !uploading && selectedImages.length > 0 ? { scale: 0.95 } : {}
            }
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <UploadCloud size={20} />
            )}
            {uploading
              ? "Uploading..."
              : `Upload ${selectedImages.length} Images`}
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ImageIcon className="text-green-500" size={24} />
            Your Images ({filteredImages.length})
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:flex-none">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by tags, filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={18} />
              Filter
            </motion.button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date To
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Operations */}
        {selectedImageIds.size > 0 && (
          <motion.div
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <span className="text-blue-700 font-medium">
                {selectedImageIds.size} images selected
              </span>

              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Add tag to all selected..."
                  value={bulkTagInput}
                  onChange={(e) => setBulkTagInput(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg flex-1 min-w-0"
                />
                <button
                  onClick={handleBulkAddTag}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Tags size={16} />
                  Add Tag
                </button>
              </div>

              <button
                onClick={() => setSelectedImageIds(new Set())}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Images Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filteredImages.length}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredImages.map((img) => (
            <motion.div
              key={img._id}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
                selectedImageIds.has(img._id)
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200"
              }`}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              {/* Selection Checkbox */}
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-gray-500">
                  {new Date(img.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => toggleImageSelection(img._id)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  {selectedImageIds.has(img._id) ? (
                    <CheckSquare className="text-blue-500" size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
              </div>

              {/* Image */}
              <img
                src={img.url}
                alt={img.filename || "Uploaded image"}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />

              {/* Tags */}
              <div className="mb-3">
                <p className="font-medium mb-2 flex items-center gap-2 text-sm">
                  <Tags size={16} />
                  Tags:
                </p>
                <div className="flex flex-wrap gap-1">
                  {img.tags.map((tag, i) => (
                    <motion.span
                      key={i}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-lg text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {tag}
                      <X
                        size={12}
                        className="ml-1 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveTag(img._id, tag)}
                      />
                    </motion.span>
                  ))}
                  {img.tags.length === 0 && (
                    <span className="text-gray-400 text-sm">No tags</span>
                  )}
                </div>
              </div>

              {/* Add Tag */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInputs[img._id] || ""}
                  onChange={(e) =>
                    setTagInputs({
                      ...tagInputs,
                      [img._id]: e.target.value,
                    })
                  }
                  className="flex-1 border border-gray-300 px-3 py-1 rounded-lg text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag(img._id)}
                />
                <motion.button
                  onClick={() => handleAddTag(img._id)}
                  className="bg-black text-white p-1 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            {userImages.length === 0
              ? "No images uploaded yet"
              : "No images found"}
          </h3>
          <p className="text-gray-400">
            {userImages.length === 0
              ? "Upload your first images to get started"
              : "Try adjusting your search or filters"}
          </p>
        </motion.div>
      )}

      {/* Select All Button */}
      {filteredImages.length > 0 && (
        <motion.div
          className="fixed bottom-6 right-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={selectAllImages}
            className="bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {selectedImageIds.size === filteredImages.length ? (
              <CheckSquare size={20} />
            ) : (
              <Square size={20} />
            )}
            Select All
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Upload;
