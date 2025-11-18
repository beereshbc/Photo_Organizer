import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { axios, setUserToken, navigate } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  //  Handle Submit (Login / Signup)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let endpoint = isLogin ? "/api/user/login" : "/api/user/signup";

      const body = isLogin ? { email, password } : { name, email, password };

      const { data } = await axios.post(endpoint, body);

      const token = data?.token;

      if (token) {
        localStorage.setItem("userToken", token);
        setUserToken(token);

        navigate("/profile");
      } else {
        alert("Something went wrong. Token not received.");
      }
    } catch (err) {
      console.error(err);
      alert(isLogin ? "Login failed!" : "Signup failed!");
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
