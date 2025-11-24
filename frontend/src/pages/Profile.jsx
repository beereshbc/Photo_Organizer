// pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Loader2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { axios, userToken } = useAppContext();

  useEffect(() => {
    if (!userToken) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/images/profile", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (res.data && res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axios, userToken]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-indigo-600"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-lg">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-center p-6 bg-white border border-red-200 rounded-lg shadow-md text-red-600"
        >
          Could not load user data.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md"
            initial={{ scale: 0.5, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <User className="w-10 h-10 text-indigo-600" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900">
            {user.name || "User Profile"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Account Details</p>
        </div>

        <motion.div className="space-y-6">
          <motion.div
            className="flex items-start p-4 bg-indigo-50/50 rounded-lg"
            variants={itemVariants}
          >
            <User className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.name || "N/A"}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start p-4 bg-indigo-50/50 rounded-lg"
            variants={itemVariants}
          >
            <Mail className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.email || "N/A"}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start p-4 bg-indigo-50/50 rounded-lg"
            variants={itemVariants}
          >
            <Calendar className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
