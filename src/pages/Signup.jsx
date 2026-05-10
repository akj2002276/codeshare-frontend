import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Signup() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    trainerKey: "",
  });

  // ================= AUTO REDIRECT =================
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }

  }, []);

  // ================= SIGNUP =================
  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await API.post(
        "/auth/register",
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

      alert("Account Created Successfully");

      navigate("/dashboard");

    } catch (error) {

      console.log(
        "SIGNUP ERROR:",
        error?.response?.data || error.message
      );

      alert(
        error?.response?.data?.message ||
        "Signup Failed"
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
          Create Account
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Join the CodeShare platform
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:border-cyan-500 transition"
            required
          />

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

          {/* ROLE */}
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value,
              })
            }
            className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:border-cyan-500 transition"
          >

            <option value="student">
              Student
            </option>

            <option value="trainer">
              Trainer
            </option>

          </select>

          {/* TRAINER SECRET */}
          {
            formData.role === "trainer" && (

              <input
                type="password"
                placeholder="Trainer Secret Key"
                value={formData.trainerKey}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trainerKey: e.target.value,
                  })
                }
                className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:border-cyan-500 transition"
                required
              />

            )
          }

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-bold text-lg disabled:opacity-60"
          >

            {
              loading
                ? "Creating..."
                : "Create Account"
            }

          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-zinc-400 mt-8">

          Already have an account?

          <Link
            to="/login"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </motion.div>

    </div>
  );
}