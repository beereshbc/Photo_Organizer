import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Play,
  Tag,
  Grid3X3,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Smart Tagging",
      description: "AI-powered automatic tagging with Google Vision API",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Instant Search",
      description: "Find any photo in seconds with tag-based search",
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Memory Slideshows",
      description: "Create and share beautiful photo slideshows",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Storage",
      description: "Your photos are safe and private",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Photos",
      description: "Drag & drop or select from your local gallery",
      icon: <Grid3X3 className="w-8 h-8" />,
    },
    {
      number: "02",
      title: "Auto Tagging",
      description: "AI automatically tags your photos with relevant labels",
      icon: <Zap className="w-8 h-8" />,
    },
    {
      number: "03",
      title: "Organize & Share",
      description: "Create slideshows and share memories",
      icon: <Globe className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
        {/* Left Content */}
        <motion.div
          className="max-w-2xl space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Organize Your Photos Effortlessly
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Smart tagging, instant search, and beautiful slideshows—all powered
            by AI. Transform your photo gallery into an organized digital memory
            bank.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold flex items-center gap-3 hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="px-8 py-4 border border-gray-300 rounded-xl font-semibold flex items-center gap-3 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
              <Play className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ rotate: -5, opacity: 0, scale: 0.9 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mt-16 md:mt-0"
        >
          <div className="relative">
            <motion.div
              className="w-80 h-96 md:w-96 md:h-[480px] bg-gray-50 rounded-3xl shadow-sm overflow-hidden border border-gray-200"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600"
                className="w-full h-full object-cover"
                alt="Photo Organization Demo"
              />
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
              initial={{ x: 20, y: -20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Tags Generated</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
              initial={{ x: -20, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  125 Photos Organized
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Organize Memories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make photo management simple and enjoyable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-6 md:px-20 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your photo collection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-300 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Organize Your Photos?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start organizing your memories today with our powerful photo
              management tools
            </p>
            <motion.button
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold flex items-center gap-3 hover:bg-gray-800 transition-colors mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Organizing
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
