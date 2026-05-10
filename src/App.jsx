import { motion } from "framer-motion";

import {
  Code2,
  Terminal,
  ShieldCheck,
  BookOpen,
  Mail,
  ArrowRight,
  Sparkles,   
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function App() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-cyan-500/20 blur-[180px] rounded-full" />

      <div className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] bg-blue-600/20 blur-[180px] rounded-full" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />



      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-8 md:px-14 py-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10">

            <Code2 className="text-cyan-400" size={30} />

          </div>

          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              codeshareX
            </h1>

            <p className="text-zinc-500 text-sm">
              by Coding Thinker
            </p>
          </div>

        </div>



        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-2xl border border-zinc-700 hover:border-cyan-500 hover:bg-cyan-500/10 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold shadow-lg shadow-cyan-500/20"
          >
            Signup
          </button>

        </div>

      </nav>



      {/* HERO */}
      <section className="relative z-10 px-8 md:px-14 pt-10 pb-24">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 mb-8">

                <Sparkles size={16} />

                Built for Trainers & Students

              </div>



              <h1 className="text-6xl md:text-7xl font-black leading-tight">

                Share Code

                <br />

                Teach Faster

                <br />

                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Learn Better
                </span>

              </h1>



              <p className="text-zinc-400 text-xl leading-relaxed mt-8 max-w-2xl">

                A modern collaborative coding platform where trainers
                can organize batches, share notes, manage code files,
                and help students learn through real-world coding
                workflows.

              </p>



              {/* BUTTONS */}
              <div className="flex flex-wrap gap-5 mt-12">

                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-5 rounded-3xl bg-cyan-500 hover:bg-cyan-600 transition text-lg font-bold flex items-center gap-3 shadow-2xl shadow-cyan-500/20"
                >

                  Get Started

                  <ArrowRight size={20} />

                </button>



                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-5 rounded-3xl border border-zinc-700 hover:border-cyan-500 hover:bg-cyan-500/10 transition text-lg font-bold"
                >
                  Login
                </button>

              </div>



              {/* STATS */}
              <div className="flex flex-wrap gap-10 mt-16">

                <div>
                  <h2 className="text-4xl font-black text-cyan-400">
                    5K+
                  </h2>

                  <p className="text-zinc-500 mt-2">
                    Students
                  </p>
                </div>

                <div>
                  <h2 className="text-4xl font-black text-cyan-400">
                    100+
                  </h2>

                  <p className="text-zinc-500 mt-2">
                    Coding Batches
                  </p>
                </div>

                <div>
                  <h2 className="text-4xl font-black text-cyan-400">
                    Live
                  </h2>

                  <p className="text-zinc-500 mt-2">
                    Real-time Learning
                  </p>
                </div>

              </div>

            </motion.div>

          </div>



          {/* RIGHT SIDE COMPILER UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >

            <div className="rounded-[35px] overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">

              {/* TOP BAR */}
              <div className="h-14 border-b border-zinc-800 flex items-center px-5 gap-3 bg-zinc-900">

                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />

                <div className="ml-4 text-zinc-400 text-sm">
                  arrays.java
                </div>

              </div>



              {/* CODE */}
              <div className="p-8 font-mono text-sm leading-8 overflow-hidden">

                <p className="text-purple-400">
                  public class Main {"{"}
                </p>

                <p className="ml-6 text-cyan-400">
                  public static void main(String[] args) {"{"}
                </p>

                <p className="ml-12 text-zinc-300">
                  int[] arr = {"{1,2,3,4,5}"};
                </p>

                <p className="ml-12 text-zinc-300">
                  for(int num : arr) {"{"}
                </p>

                <p className="ml-20 text-green-400">
                  System.out.println(num);
                </p>

                <p className="ml-12 text-zinc-300">
                  {"}"}
                </p>

                <p className="ml-6 text-cyan-400">
                  {"}"}
                </p>

                <p className="text-purple-400">
                  {"}"}
                </p>

              </div>

            </div>



            {/* FLOATING CARDS */}
            <div className="absolute -left-8 top-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl">

              <div className="flex items-center gap-3">

                <Terminal className="text-cyan-400" />

                <div>
                  <p className="font-semibold">
                    Monaco Editor
                  </p>
                  <p className="text-zinc-500 text-sm">
                    VS Code Experience
                  </p>
                </div>

              </div>

            </div>



            <div className="absolute -right-8 bottom-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl">

              <div className="flex items-center gap-3">

                <ShieldCheck className="text-cyan-400" />

                <div>
                  <p className="font-semibold">
                    Secure Access
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Batch Protected
                  </p>
                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* FEATURES */}
      <section className="relative z-10 px-8 md:px-14 pb-28">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-black mb-6">
              Everything Needed For
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}Modern Coding Education
              </span>
            </h2>

            <p className="text-zinc-500 text-xl">
              Built for scalable training programs and real-world coding practice.
            </p>

          </div>



          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500 transition">

              <Terminal className="text-cyan-400 mb-6" size={40} />

              <h3 className="text-2xl font-bold mb-4">
                Live Code Sharing
              </h3>

              <p className="text-zinc-500 leading-relaxed">
                Trainers can create topics, manage files, and instantly share
                production-level code with students.
              </p>

            </div>



            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500 transition">

              <ShieldCheck className="text-cyan-400 mb-6" size={40} />

              <h3 className="text-2xl font-bold mb-4">
                Secure Batch Access
              </h3>

              <p className="text-zinc-500 leading-relaxed">
                Access-key based protected batches ensure only enrolled
                students can access learning materials.
              </p>

            </div>



            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500 transition">

              <BookOpen className="text-cyan-400 mb-6" size={40} />

              <h3 className="text-2xl font-bold mb-4">
                Structured Learning
              </h3>

              <p className="text-zinc-500 leading-relaxed">
                Organize DSA, Java, MERN, AI and development content
                in a clean and scalable workspace.
              </p>

            </div>

          </div>

        </div>

      </section>



      {/* FOOTER */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950/40 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-8 md:px-14 py-16">

          <div className="grid md:grid-cols-3 gap-14">

            {/* BRAND */}
            <div>

              <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Coding Thinker
              </h2>

              <p className="text-zinc-500 mt-5 leading-relaxed">
                Empowering students with industry-level coding education,
                live development training and placement-oriented learning.
              </p>

            </div>



            {/* LINKS */}
            <div>

              <h3 className="text-xl font-bold mb-6">
                Explore
              </h3>

              <div className="flex flex-col gap-4 text-zinc-400">

                <a
                  href="https://codingthinker.com"
                  target="_blank"
                  className="hover:text-cyan-400 transition"
                >
                  Explore Courses
                </a>

                <a
                  href="https://codingthinker.com"
                  target="_blank"
                  className="hover:text-cyan-400 transition"
                >
                  MERN Stack Bootcamp
                </a>

                <a
                  href="https://codingthinker.com"
                  target="_blank"
                  className="hover:text-cyan-400 transition"
                >
                  DSA Training
                </a>

              </div>

            </div>



            {/* CONTACT */}
            <div>

              <h3 className="text-xl font-bold mb-6">
                Connect
              </h3>

              <div className="flex flex-col gap-5 text-zinc-400">

                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  hello@codingthinker.com
                </div>

                {/* <div className="flex items-center gap-3">
                  <GithubIcon size={18} />
                  CodeShareX Platform
                </div> */}

              </div>

            </div>

          </div>



          {/* BOTTOM */}
          <div className="border-t border-zinc-800 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-zinc-500">
              © 2026 Coding Thinker. All rights reserved.
            </p>

            <p className="text-zinc-600 text-sm">
              Built with React, Monaco Editor, Express & MongoDB
            </p>

          </div>

        </div>

      </footer>

    </div>

  );

}