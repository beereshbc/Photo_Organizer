import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { axios, setUserToken, navigate } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const { data } = await axios.post("/api/images/login", {
          email,
          password,
        });

        if (data.success && data.token) {
          localStorage.setItem("userToken", data.token);
          setUserToken(data.token);

          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(data.message || "Login failed!");
        }
      } else {
        const { data } = await axios.post("/api/images/register", {
          name,
          email,
          password,
        });

        if (data.success && data.token) {
          localStorage.setItem("userToken", data.token);
          setUserToken(data.token);

          toast.success("Signup successful!");
          navigate("/");
        } else {
          toast.error(data.message || "Signup failed!");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name (signup only) */}
          {!isLogin && (
            <div>
              <label className="text-gray-700 text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg text-lg font-medium hover:bg-gray-800 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Switch to login/signup */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-black font-medium underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
