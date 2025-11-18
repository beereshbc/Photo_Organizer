import React, { useState, useRef, useEffect } from "react";
import {
  ImagePlus,
  FolderOpen,
  Tag,
  Search,
  X,
  Plus,
  Filter,
  Grid3X3,
  List,
  Download,
  Share2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Upload = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    "Family",
    "Vacation",
    "Nature",
    "Portrait",
    "Event",
  ]);
  const [newTag, setNewTag] = useState("");
  const [editingImageId, setEditingImageId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [filteredImages, setFilteredImages] = useState([]);
  const fileInputRef = useRef(null);

  // Filter images based on search and tags
  useEffect(() => {
    let result = images;

    if (searchTerm) {
      result = result.filter(
        (img) =>
          img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((img) =>
        selectedTags.every((selectedTag) =>
          img.tags.some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
          )
        )
      );
    }

    setFilteredImages(result);
  }, [images, searchTerm, selectedTags]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imgURLs = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      tags: [],
      uploadedAt: new Date().toISOString(),
    }));
    setImages((prev) => [...prev, ...imgURLs]);
  };

  const addTagToImage = (imageId, tag) => {
    if (!tag.trim()) return;

    const tagToAdd = tag.trim().toLowerCase();
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? { ...img, tags: [...new Set([...img.tags, tagToAdd])] }
          : img
      )
    );

    // Add to available tags if not already there
    if (!availableTags.some((t) => t.toLowerCase() === tagToAdd)) {
      setAvailableTags((prev) => [...prev, tagToAdd]);
    }

    setNewTag("");
  };

  const removeTagFromImage = (imageId, tagToRemove) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? { ...img, tags: img.tags.filter((tag) => tag !== tagToRemove) }
          : img
      )
    );
  };

  const handleAddNewTag = () => {
    if (
      newTag.trim() &&
      !availableTags.some(
        (tag) => tag.toLowerCase() === newTag.trim().toLowerCase()
      )
    ) {
      setAvailableTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const toggleTagFilter = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileType = (fileName) => {
    return fileName.split(".").pop()?.toUpperCase() || "IMG";
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-16 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Photo Gallery</h1>
        <p className="text-gray-600">
          Upload, organize, and tag your photos for easy searching and
          management
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by filename or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl border ${
                viewMode === "grid"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl border ${
                viewMode === "list"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Filter by tags:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTagFilter(tag)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}

            {/* Add New Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                onKeyPress={(e) => e.key === "Enter" && handleAddNewTag()}
              />
              <button
                onClick={handleAddNewTag}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedTags.length > 0) && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm flex items-center gap-1">
                    Search: "{searchTerm}"
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </span>
                )}
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleTagFilter(tag)}
                    />
                  </span>
                ))}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Box */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-gray-50 mb-12 hover:border-gray-400 transition-colors"
        onClick={triggerFileInput}
      >
        <FolderOpen size={60} className="text-gray-400 mb-4" />
        <p className="text-xl font-medium mb-2">Click to upload photos</p>
        <p className="text-gray-500">
          PNG, JPG, JPEG supported • Drag & drop supported
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          multiple
          accept="image/*"
          className="hidden"
        />
      </motion.div>

      {/* Gallery Header */}
      {images.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Your Photos ({filteredImages.length})
            </h2>
            {filteredImages.length !== images.length && (
              <p className="text-gray-600 text-sm">
                Filtered from {images.length} total photos
              </p>
            )}
          </div>
        </div>
      )}

      {/* Gallery */}
      <AnimatePresence>
        {filteredImages.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={
                  viewMode === "grid"
                    ? "group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    : "flex gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                }
              >
                {/* Image */}
                <div
                  className={
                    viewMode === "grid"
                      ? "aspect-square overflow-hidden bg-gray-100"
                      : "w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100"
                  }
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className={viewMode === "grid" ? "p-4" : "flex-1 min-w-0"}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {img.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getFileType(img.name)} •{" "}
                        {new Date(img.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Tags
                      </span>
                    </div>

                    {/* Existing Tags */}
                    <div className="flex flex-wrap gap-2">
                      {img.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center gap-1 group/tag"
                        >
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer opacity-0 group-hover/tag:opacity-100 transition-opacity"
                            onClick={() => removeTagFromImage(img.id, tag)}
                          />
                        </span>
                      ))}
                    </div>

                    {/* Add Tag Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add tag..."
                        value={editingImageId === img.id ? newTag : ""}
                        onChange={(e) => setNewTag(e.target.value)}
                        onFocus={() => setEditingImageId(img.id)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addTagToImage(img.id, newTag)
                        }
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                      <button
                        onClick={() => addTagToImage(img.id, newTag)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No photos found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 text-black underline hover:text-gray-700"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Upload;
