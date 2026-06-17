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

<div className="min-h-screen bg-[#04040a] text-white overflow-hidden relative">

    {/* Premium Background */}

    <div className="fixed inset-0 pointer-events-none">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,212,170,.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,.12),transparent_40%)]"/>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:48px_48px]"/>

    </div>

    {/* NAVBAR */}

    <nav className="sticky top-5 z-50 px-6 lg:px-10">

        <div className="max-w-7xl mx-auto">

            <div className="rounded-[30px] border border-cyan-500/20 bg-[#070711]/80 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10">

                <div className="flex items-center justify-between px-8 py-5">

                    <div className="flex items-center gap-5">

                        <div className="relative">

                            <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-40 animate-pulse"/>

                            <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">

                                <Code2 size={30} className="text-black"/>

                            </div>

                        </div>

                        <div>

                            <h1 className="text-4xl font-black tracking-tight">

                                code<span className="text-cyan-400">shareX</span>

                            </h1>

                            <p className="text-xs text-zinc-500">

                                AI Powered Coding Workspace

                            </p>

                        </div>

                    </div>

                    <div className="hidden lg:flex items-center gap-3">

                        <div className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">

                            Playground

                        </div>

                        <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm">

                            Community

                        </div>

                        <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm">

                            Leaderboard

                        </div>

                    </div>

                    <div className="flex gap-3">

                        <button

                        onClick={()=>navigate("/login")}

                        className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">

                            Login

                        </button>

                        <button

                        onClick={()=>navigate("/signup")}

                        className="px-7 py-3 rounded-2xl bg-cyan-400 text-black font-black hover:scale-105 transition">

                            Get Started

                        </button>

                    </div>

                </div>

            </div>

        </div>

    </nav>

    {/* HERO */}

    <section className="relative z-10 pt-20 pb-24 px-6 lg:px-10">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

            <motion.div

            initial={{opacity:0,y:30}}

            animate={{opacity:1,y:0}}

            transition={{duration:.8}}

            >

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 mb-10">

                    <Sparkles size={18}/>

                    Next Generation Coding Platform

                </div>

                <h1 className="text-6xl lg:text-8xl font-black leading-none">

                    Learn.

                    <br/>

                    Practice.

                    <br/>

                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">

                        Collaborate.

                    </span>

                </h1>

                <p className="text-zinc-400 text-xl mt-8 max-w-2xl leading-relaxed">

                    Modern collaborative coding platform for trainers and students.

                    Share notes, compiler sessions, code files and learning resources

                    inside one beautiful workspace.

                </p>

                <div className="flex flex-wrap gap-5 mt-12">

                    <button

                    onClick={()=>navigate("/signup")}

                    className="group px-8 py-5 rounded-3xl bg-cyan-400 text-black font-black flex items-center gap-3 hover:scale-105 transition">

                        Start Learning

                        <ArrowRight className="group-hover:translate-x-2 transition"/>

                    </button>

                    <button

                    onClick={()=>navigate("/login")}

                    className="px-8 py-5 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-bold">

                        Login

                    </button>

                </div>

                <div className="grid grid-cols-3 gap-5 mt-16">

                    <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6">

                        <h2 className="text-4xl font-black text-cyan-400">

                            5000+

                        </h2>

                        <p className="text-zinc-500 mt-2">

                            Students

                        </p>

                    </div>

                    <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6">

                        <h2 className="text-4xl font-black text-blue-400">

                            100+

                        </h2>

                        <p className="text-zinc-500 mt-2">

                            Batches

                        </p>

                    </div>

                    <div className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">

                        <h2 className="text-4xl font-black text-orange-400">

                            Live

                        </h2>

                        <p className="text-zinc-500 mt-2">

                            Compiler

                        </p>

                    </div>

                </div>

            </motion.div>

            <motion.div

            initial={{opacity:0,scale:.92}}

            animate={{opacity:1,scale:1}}

            transition={{duration:.8}}

            className="relative">

                <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-cyan-500/20 blur-3xl"/>

                <div className="rounded-[36px] overflow-hidden border border-cyan-500/20 bg-[#070711]/90 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10">

                    <div className="h-16 border-b border-white/10 flex items-center px-6 gap-3">

                        <div className="w-3 h-3 rounded-full bg-red-500"/>

                        <div className="w-3 h-3 rounded-full bg-yellow-500"/>

                        <div className="w-3 h-3 rounded-full bg-green-500"/>

                        <span className="ml-5 text-zinc-500 text-sm">

                            arrays.java

                        </span>

                    </div>

                    <div className="p-8 font-mono leading-9">

                        <p className="text-purple-400">public class Main {"{"}</p>

                        <p className="ml-8 text-cyan-400">

                            public static void main(String[] args) {"{"}

                        </p>

                        <p className="ml-16 text-zinc-300">

                            int sum = 0;

                        </p>

                        <p className="ml-16 text-zinc-300">

                            for(int i=1;i&lt;=10;i++){"{"}

                        </p>

                        <p className="ml-24 text-green-400">

                            sum += i;

                        </p>

                        <p className="ml-16 text-zinc-300">

                            {"}"}

                        </p>

                        <p className="ml-16 text-orange-300">

                            System.out.println(sum);

                        </p>

                        <p className="ml-8 text-cyan-400">

                            {"}"}

                        </p>

                        <p className="text-purple-400">

                            {"}"}

                        </p>

                    </div>

                </div>

                <div className="absolute -left-6 top-12 bg-[#0b0b15] border border-cyan-500/20 rounded-2xl p-4">

                    <Terminal className="text-cyan-400 mb-2"/>

                    <p className="font-bold">Monaco Editor</p>

                    <p className="text-xs text-zinc-500">

                        VS Code Experience

                    </p>

                </div>

                <div className="absolute -right-6 bottom-12 bg-[#0b0b15] border border-cyan-500/20 rounded-2xl p-4">

                    <ShieldCheck className="text-cyan-400 mb-2"/>

                    <p className="font-bold">

                        Protected Workspace

                    </p>

                    <p className="text-xs text-zinc-500">

                        Secure Access

                    </p>

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
{/* FEATURES */}

<section className="relative z-10 px-6 lg:px-10 pb-28">

    <div className="max-w-7xl mx-auto">

        <div className="text-center mb-20">

            <div className="inline-flex px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 mb-6">

                Why CodeShareX

            </div>

            <h2 className="text-5xl lg:text-6xl font-black leading-tight">

                Everything You Need

                <br />

                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">

                    In One Workspace

                </span>

            </h2>

            <p className="text-zinc-500 text-xl mt-8 max-w-3xl mx-auto">

                Built for coding communities, colleges, trainers and students.

            </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

            <motion.div

                whileHover={{ y: -8 }}

                className="rounded-[30px] border border-cyan-500/20 bg-[#070711]/80 backdrop-blur-xl p-8 shadow-xl shadow-cyan-500/5"

            >

                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-8">

                    <Terminal className="text-cyan-400" size={32} />

                </div>

                <h3 className="text-3xl font-black mb-5">

                    Live Compiler

                </h3>

                <p className="text-zinc-500 leading-8">

                    Practice Java, C++, Python and JavaScript with a VS Code

                    like experience and instant execution.

                </p>

            </motion.div>

            <motion.div

                whileHover={{ y: -8 }}

                className="rounded-[30px] border border-blue-500/20 bg-[#070711]/80 backdrop-blur-xl p-8 shadow-xl shadow-blue-500/5"

            >

                <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-8">

                    <ShieldCheck className="text-blue-400" size={32} />

                </div>

                <h3 className="text-3xl font-black mb-5">

                    Secure Batches

                </h3>

                <p className="text-zinc-500 leading-8">

                    Access-key protected workspaces where trainers share notes,

                    assignments and coding resources.

                </p>

            </motion.div>

            <motion.div

                whileHover={{ y: -8 }}

                className="rounded-[30px] border border-purple-500/20 bg-[#070711]/80 backdrop-blur-xl p-8 shadow-xl shadow-purple-500/5"

            >

                <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center mb-8">

                    <BookOpen className="text-purple-400" size={32} />

                </div>

                <h3 className="text-3xl font-black mb-5">

                    Structured Learning

                </h3>

                <p className="text-zinc-500 leading-8">

                    Organize DSA, Java, MERN, AI and interview preparation

                    inside one beautiful dashboard.

                </p>

            </motion.div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">

            <div className="rounded-[35px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-xl p-10">

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-4xl font-black">

                        AI Powered Learning

                    </h2>

                    <Sparkles className="text-cyan-400" size={35} />

                </div>

                <p className="text-zinc-400 leading-8 text-lg">

                    Learn faster with modern collaborative coding,

                    instant compiler execution, community discussions,

                    coding contests and structured learning paths.

                </p>

                <button

                    onClick={() => navigate("/signup")}

                    className="mt-10 px-8 py-4 rounded-2xl bg-cyan-400 text-black font-black hover:scale-105 transition"

                >

                    Explore Platform

                </button>

            </div>

            <div className="rounded-[35px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent backdrop-blur-xl p-10">

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-4xl font-black">

                        Community Driven

                    </h2>

                    <Code2 className="text-orange-400" size={35} />

                </div>

                <p className="text-zinc-400 leading-8 text-lg">

                    Connect trainers and students through a single

                    collaborative environment with real-world projects,

                    discussions and coding challenges.

                </p>

                <button

                    onClick={() => navigate("/login")}

                    className="mt-10 px-8 py-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 transition"

                >

                    Join Community

                </button>

            </div>

        </div>

    </div>

</section>

{/* CTA */}

<section className="relative z-10 px-6 lg:px-10 pb-24">

    <div className="max-w-7xl mx-auto">

        <div className="rounded-[40px] overflow-hidden border border-cyan-500/20 bg-[#070711]/80 backdrop-blur-2xl relative">

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"/>

            <div className="relative p-14 text-center">

                <div className="inline-flex px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 mb-8">

                    Ready to Start?

                </div>

                <h2 className="text-5xl lg:text-7xl font-black leading-tight">

                    Build.

                    Learn.

                    Grow.

                </h2>

                <p className="text-zinc-400 text-xl max-w-3xl mx-auto mt-8">

                    Experience a premium coding workspace built for

                    the next generation of developers.

                </p>

                <div className="flex justify-center flex-wrap gap-5 mt-12">

                    <button

                        onClick={() => navigate("/signup")}

                        className="px-10 py-5 rounded-3xl bg-cyan-400 text-black font-black hover:scale-105 transition"

                    >

                        Get Started

                    </button>

                    <button

                        onClick={() => navigate("/login")}

                        className="px-10 py-5 rounded-3xl border border-white/10 bg-white/5"

                    >

                        Login

                    </button>

                </div>

            </div>

        </div>

    </div>

</section>

{/* FOOTER */}

<footer className="border-t border-white/5 bg-[#04040a] relative z-10">

    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

        <div className="grid lg:grid-cols-3 gap-14">

            <div>

                <h1 className="text-5xl font-black">

                    code<span className="text-cyan-400">shareX</span>

                </h1>

                <p className="text-zinc-500 mt-6 leading-8">

                    A futuristic collaborative coding workspace

                    designed for trainers, coding communities,

                    colleges and students.

                </p>

            </div>

            <div>

                <h3 className="font-black text-2xl mb-8">

                    Platform

                </h3>

                <div className="space-y-4 text-zinc-500">

                    <p className="hover:text-cyan-400 cursor-pointer">

                        Playground

                    </p>

                    <p className="hover:text-cyan-400 cursor-pointer">

                        Leaderboard

                    </p>

                    <p className="hover:text-cyan-400 cursor-pointer">

                        Community

                    </p>

                </div>

            </div>

            <div>

                <h3 className="font-black text-2xl mb-8">

                    Contact

                </h3>

                <div className="flex items-center gap-3 text-zinc-500">

                    <Mail size={18}/>

                    hello@codingthinker.com

                </div>

            </div>

        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col lg:flex-row justify-between">

            <p className="text-zinc-600">

                © 2026 CodeShareX • Built by Coding Thinker

            </p>

            <p className="text-zinc-600">

                React • Express • MongoDB • Monaco • Socket.io

            </p>

        </div>

    </div>

</footer>

    </div>

  );

}