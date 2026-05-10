import {
  motion,
} from "framer-motion";

import {
  Code2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

export default function App() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full" />



      {/* NAVBAR */}
      <div className="w-full flex items-center justify-between px-10 py-8 relative z-10">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

            <Code2
              className="text-cyan-400"
              size={28}
            />

          </div>

          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

            CodeShare

          </h1>

        </div>



        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              navigate("/login")
            }
            className="px-6 py-3 rounded-2xl border border-zinc-700 hover:border-cyan-500 hover:bg-cyan-500/10 transition"
          >

            Login

          </button>



          <button
            onClick={() =>
              navigate("/signup")
            }
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold"
          >

            Signup

          </button>

        </div>

      </div>



      {/* HERO SECTION */}
      <div className="flex-1 flex items-center justify-center px-10 relative z-10">

        <div className="max-w-5xl text-center">

          <motion.h1

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.8,
            }}

            className="text-7xl md:text-8xl font-black leading-tight mb-8"
          >

            The Modern Platform

            <br />

            For Sharing

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

              {" "}Code

            </span>

          </motion.h1>



          <motion.p

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.2,
              duration: 0.8,
            }}

            className="text-zinc-400 text-2xl leading-relaxed max-w-3xl mx-auto"
          >

            A complete platform for trainers and students
            to share, manage, organize and access code
            beautifully.

            <br />

            Built by Coding Thinker.

          </motion.p>



          {/* BUTTONS */}
          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.4,
              duration: 0.8,
            }}

            className="flex items-center justify-center gap-6 mt-12"
          >

            <button
              onClick={() =>
                navigate("/signup")
              }
              className="px-10 py-5 rounded-3xl bg-cyan-500 hover:bg-cyan-600 transition text-xl font-bold shadow-2xl shadow-cyan-500/20"
            >

              Get Started

            </button>



            <button
              onClick={() =>
                navigate("/login")
              }
              className="px-10 py-5 rounded-3xl border border-zinc-700 hover:border-cyan-500 hover:bg-cyan-500/10 transition text-xl font-bold"
            >

              Login

            </button>

          </motion.div>

        </div>

      </div>



      {/* FOOTER */}
      <footer className="relative z-10 border-t border-zinc-900 px-10 py-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* LEFT */}
          <div>

            <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

              Coding Thinker

            </h2>

            <p className="text-zinc-500 mt-3 max-w-md">

              Empowering students through industry-level
              coding education and real-world development.

            </p>

          </div>



          {/* RIGHT */}
          <div className="flex flex-col items-start md:items-end gap-3 text-zinc-400">

            <p>
              Support
            </p>

            <p>
              hello@codingthinker.com
            </p>

            <p>
              © 2026 Coding Thinker
            </p>

          </div>

        </div>

      </footer>

    </div>

  );

}