import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= AUTO LOGIN =================
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }

  }, []);

  // ================= LOGIN =================
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        response.data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      console.log(
        "LOGIN ERROR:",
        error?.response?.data || error.message
      );

      alert(
        error?.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-6">

      {/* GLOW EFFECTS */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full" />

      {/* CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-[40px] p-10 relative z-10 shadow-2xl"
      >

        {/* TITLE */}
        <h1 className="text-5xl font-black text-center mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Login to continue to CodeShare
        </p>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:border-cyan-500 transition"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:border-cyan-500 transition"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-bold text-lg disabled:opacity-60"
          >

            {
              loading
                ? "Logging In..."
                : "Login"
            }

          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-zinc-400 mt-8">

          Don’t have an account?

          <Link
            to="/signup"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Signup
          </Link>

        </p>

      </motion.div>

    </div>
  );
}