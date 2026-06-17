import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  FolderKanban,
  LogOut,
  Plus,
  Bell,
  Trophy,
  Code2,
  Users,
  CalendarDays,
  ExternalLink,
  Sparkles,
  Zap,
  Trash2,
  Bug,
  TicketCheck,
  UserCircle,
  CheckCircle,
  Crown,
  Medal,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import socket from "../socket";

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [batches, setBatches] = useState([]);
  const [contests, setContests] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [profileCompleted, setProfileCompleted] = useState(false);
  const [profile, setProfile] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);

  const [batchData, setBatchData] = useState({
    batchName: "",
    description: "",
    accessKey: "",
  });

  const [contestData, setContestData] = useState({
    contestName: "",
    batchName: "",
    platform: "HackerRank",
    contestLink: "",
    contestDate: "",
    contestTime: "",
  });

  const announcements = [
    {
      title: "New DSA practice files uploaded",
      desc: "Check the latest batch workspace for updated problem solutions.",
      tag: "Update",
    },
    {
      title: "Practice Arena is live",
      desc: "Students can now run Java, C++, Python and JavaScript code.",
      tag: "New",
    },
    {
      title: "Weekly coding challenge preparation",
      desc: "Revise arrays, strings and recursion before upcoming contests.",
      tag: "Reminder",
    },
  ];

  const defaultContests = [
    {
      platform: "LeetCode",
      title: "Weekly Contest",
      time: "Sunday • 8:00 AM",
      url: "https://leetcode.com/contest/",
      color: "from-yellow-400 to-orange-500",
    },
    {
      platform: "Codeforces",
      title: "Upcoming Round",
      time: "Check schedule",
      url: "https://codeforces.com/contests",
      color: "from-blue-400 to-cyan-500",
    },
    {
      platform: "CodeChef",
      title: "Starters",
      time: "Wednesday • Evening",
      url: "https://www.codechef.com/contests",
      color: "from-purple-400 to-pink-500",
    },
  ];

  const fetchBatches = async () => {
    try {
      const response = await API.get("/batches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContests = async () => {
    try {
      const response = await API.get("/contests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContests(response.data || []);
    } catch (error) {
      console.log("FETCH CONTESTS ERROR:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await API.get("/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileCompleted(response.data.profileCompleted);
      setProfile(response.data.profile);
    } catch (error) {
      console.log("FETCH PROFILE ERROR:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await API.get("/leaderboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.leaderboard || [];

      setLeaderboard(data);

      const currentUser = data.find(
        (student) => student.email === user?.email
      );

      setMyRank(currentUser || null);
    } catch (error) {
      console.log("LEADERBOARD ERROR:", error);
    }
  };

  const createBatch = async () => {
    try {
      const response = await API.post("/batches", batchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBatches([...batches, response.data.batch]);

      setShowModal(false);

      setBatchData({
        batchName: "",
        description: "",
        accessKey: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createContest = async () => {
    try {
      const response = await API.post("/contests", contestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContests([response.data.contest, ...contests]);

      setShowContestModal(false);

      setContestData({
        contestName: "",
        batchName: "",
        platform: "HackerRank",
        contestLink: "",
        contestDate: "",
        contestTime: "",
      });
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add contest");
      console.log(error);
    }
  };

  const deleteContest = async (contestId) => {
    try {
      await API.delete(`/contests/${contestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContests(contests.filter((contest) => contest._id !== contestId));
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete contest");
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    fetchBatches();
    fetchContests();
    fetchProfile();
    fetchLeaderboard();

    socket.emit("user-online", user?._id);

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#04040a] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,212,170,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(108,99,255,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(245,166,35,0.14),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,170,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,170,0.06)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,212,170,0.05)_50%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.035)_0px,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_6px)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-4 z-40 mb-6"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-[#00d4aa]/20 bg-[#070711]/90 backdrop-blur-2xl shadow-2xl shadow-[#00d4aa]/10">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00d4aa]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d4aa]/8 via-transparent to-[#6c63ff]/10" />

            <div className="relative px-5 py-4 flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-4">
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#6c63ff] blur-xl opacity-60 animate-pulse" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#00d4aa] flex items-center justify-center shadow-xl shadow-[#6c63ff]/30">
                      <Code2 className="text-white" size={26} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
                        codeshare<span className="text-[#00d4aa]">X</span>
                      </h1>
                      <span className="hidden sm:inline-flex text-[10px] px-2 py-1 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/10 text-[#00d4aa] font-black">
                        AI-led
                      </span>
                    </div>
                    <p className="text-xs text-[#7c7798] mt-1">
                      AI-led coding workspace by Coding Thinker
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap rounded-3xl border border-white/10 bg-black/25 p-2">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => window.open("/practice", "_blank")}
                    className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#8d86ad] hover:text-white hover:bg-white/8 transition"
                  >
                    <Zap size={16} className="text-[#6c63ff]" />
                    <span>Playground</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/profile")}
                    className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#8d86ad] hover:text-white hover:bg-white/8 transition"
                  >
                    <UserCircle size={16} />
                    <span>Profile</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/leaderboard")}
                    className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm bg-[#00d4aa]/10 border border-[#00d4aa]/25 text-[#00d4aa] shadow-lg shadow-[#00d4aa]/10 transition"
                  >
                    <Trophy size={16} />
                    <span>Leaderboard</span>
                  </motion.button>

                  {user?.role === "student" && (
                    <motion.button
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => window.open("/debug", "_blank")}
                      className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#8d86ad] hover:text-white hover:bg-white/8 transition"
                    >
                      <Bug size={16} />
                      <span>Ask Doubt</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => window.open("/community", "_blank")}
                    className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#8d86ad] hover:text-white hover:bg-white/8 transition"
                  >
                    <Users size={16} />
                    <span>Community</span>
                  </motion.button>

                  {user?.role === "trainer" && (
                    <motion.button
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => window.open("/tickets", "_blank")}
                      className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#8d86ad] hover:text-white hover:bg-white/8 transition"
                    >
                      <TicketCheck size={16} />
                      <span>Tickets</span>
                    </motion.button>
                  )}

                  {user?.role === "trainer" && (
                    <motion.button
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => window.open("/live", "_blank")}
                      className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#8d86ad] hover:text-white hover:bg-white/8 transition"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Open Live</span>
                    </motion.button>
                  )}

                  {user?.role === "student" && (
                    <motion.button
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => window.open("/live", "_blank")}
                      className="group relative overflow-hidden rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#8d86ad] hover:text-white hover:bg-white/8 transition"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Open Live</span>
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap xl:justify-end">
                  <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/8 px-4 py-2.5 text-[#00d4aa] font-mono text-sm">
                    <Zap size={15} />
                    {new Date().toLocaleTimeString()}
                  </div>

                  {user?.role === "trainer" && (
                    <>
                      <button
                        onClick={() => setShowContestModal(true)}
                        className="rounded-2xl border border-[#f5a623]/30 bg-[#f5a623]/10 hover:bg-[#f5a623]/20 text-[#f5a623] px-4 py-2.5 flex items-center gap-2 text-sm font-bold transition"
                      >
                        <Trophy size={16} />
                        Contest
                      </button>

                      <button
                        onClick={() => setShowModal(true)}
                        className="rounded-2xl bg-[#00d4aa] hover:bg-[#12f0c6] text-black px-4 py-2.5 flex items-center gap-2 text-sm font-black transition shadow-lg shadow-[#00d4aa]/20"
                      >
                        <Plus size={16} />
                        Batch
                      </button>
                    </>
                  )}

                  <button
                    onClick={logout}
                    className="rounded-2xl border border-white/10 bg-white/5 hover:bg-red-500/15 hover:border-red-400/30 px-4 py-2.5 flex items-center gap-2 text-sm font-bold text-[#8d86ad] hover:text-red-300 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {user?.role === "student" && !profileCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative overflow-hidden rounded-[28px] border border-[#00d4aa]/20 bg-[#00d4aa]/8 backdrop-blur-2xl p-5 shadow-2xl shadow-[#00d4aa]/10"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(0,212,170,0.18),transparent)] opacity-30" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#00d4aa] shadow-lg shadow-[#00d4aa]/50" />
                <div>
                  <h2 className="text-lg font-black">
                    Complete Your Coding Profile
                  </h2>

                  <p className="text-sm text-[#8d86ad] mt-1">
                    Add LeetCode · GitHub · LinkedIn to unlock full ranking.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/complete-profile")}
                className="px-6 py-3 rounded-2xl bg-[#00d4aa] hover:bg-[#12f0c6] text-black text-sm font-black"
              >
                Complete Now →
              </button>
            </div>
          </motion.div>
        )}

        {user?.role === "student" && profileCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative overflow-hidden rounded-[28px] border border-[#00d4aa]/20 bg-[#00d4aa]/8 backdrop-blur-2xl p-5"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(0,212,170,0.16),transparent)] opacity-30" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#00d4aa] shadow-lg shadow-[#00d4aa]/50" />
                <div>
                  <h2 className="text-lg font-black">
                    Your Coding Profile is Ready
                  </h2>

                  <p className="text-sm text-[#8d86ad] mt-1">
                    {profile?.college || "College not added"} ·{" "}
                    {profile?.batch || "Batch not added"} · LeetCode · GitHub ·
                    LinkedIn connected
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-3 rounded-2xl bg-[#00d4aa] hover:bg-[#12f0c6] text-black text-sm font-black"
              >
                View Profile →
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[28px] border border-[#f5a623]/30 bg-[#080711]/85 backdrop-blur-2xl shadow-2xl shadow-[#f5a623]/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,166,35,0.22),transparent_45%)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-[#f5a623]/20 px-7 py-5">
                <div className="flex items-center gap-3">
                  <Crown className="text-[#f5a623]" size={20} />
                  <h2 className="tracking-[0.2em] text-sm font-black text-[#f5a623]">
                    YOUR PROFILE
                  </h2>
                </div>

                {/* <span className="rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20 px-4 py-1.5 text-xs font-black text-[#f5a623]">
                  TOP 10%
                </span> */}
              </div>

              <div className="p-7">
                <h1 className="text-8xl lg:text-9xl font-black text-[#f5a623] tracking-tight drop-shadow-[0_0_35px_rgba(245,166,35,0.35)]">
                  {myRank ? `#${myRank.rank}` : "--"}
                </h1>

                <p className="text-[#8d86ad] mt-3 text-lg">
                  {myRank
                    ? `${myRank.leetcodeTotalSolved || 0} Problems Solved`
                    : "Sync your LeetCode profile"}
                </p>

                <div className="grid grid-cols-3 gap-3 mt-7">
                  <div className="rounded-2xl border border-[#00d4aa]/30 bg-[#00d4aa]/8 p-4 text-center">
                    <p className="text-2xl font-black text-[#00d4aa]">
                      {myRank?.leetcodeEasySolved || 0}
                    </p>
                    <p className="text-xs text-[#8d86ad]">Easy</p>
                  </div>

                  <div className="rounded-2xl border border-[#f5a623]/30 bg-[#f5a623]/8 p-4 text-center">
                    <p className="text-2xl font-black text-[#f5a623]">
                      {myRank?.leetcodeMediumSolved || 0}
                    </p>
                    <p className="text-xs text-[#8d86ad]">Medium</p>
                  </div>

                  <div className="rounded-2xl border border-rose-400/30 bg-rose-400/8 p-4 text-center">
                    <p className="text-2xl font-black text-rose-400">
                      {myRank?.leetcodeHardSolved || 0}
                    </p>
                    <p className="text-xs text-[#8d86ad]">Hard</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs text-[#8d86ad] mb-2">
                    <span>Progress to Rank #50</span>
                    <span className="text-[#f5a623]">64%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                    <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-[#f5a623] to-orange-400" />
                  </div>
                </div>

                <button
                  onClick={() => navigate("/leaderboard")}
                  className="mt-7 w-full rounded-2xl bg-[#f5a623] hover:bg-[#ffb536] text-black p-4 font-black shadow-xl shadow-[#f5a623]/25"
                >
                  ↗ View Full Rankings
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[28px] border border-[#00d4aa]/25 bg-[#080711]/85 backdrop-blur-2xl shadow-2xl shadow-[#00d4aa]/10"
          >
            <div className="flex items-center justify-between border-b border-[#00d4aa]/20 px-7 py-5">
              <div className="flex items-center gap-3">
                <Trophy className="text-[#00d4aa]" size={20} />
                <h2 className="text-xl font-black">Top 5 Students</h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#8d86ad]">
                <span className="w-3 h-3 rounded-full bg-[#00d4aa] shadow-lg shadow-[#00d4aa]/50" />
                Live
              </div>
            </div>

            <div className="p-7 space-y-5">
              {leaderboard.slice(0, 5).map((student) => (
                <motion.div
                  key={student._id}
                  whileHover={{ x: 6 }}
                  className={`flex items-center justify-between rounded-2xl transition ${
                    student.email === user?.email ? "bg-[#00d4aa]/8" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        student.rank === 1
                          ? "text-[#f5a623] bg-[#f5a623]/10 shadow-lg shadow-[#f5a623]/20"
                          : student.rank === 2
                          ? "text-slate-200 bg-white/10"
                          : student.rank === 3
                          ? "text-orange-400 bg-orange-400/10"
                          : "text-[#8d86ad] bg-white/8"
                      }`}
                    >
                      {student.rank}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#6c63ff] flex items-center justify-center text-black font-black">
                      {student.name?.charAt(0) || "S"}
                    </div>

                    <div>
                      <h3 className="font-black">{student.name}</h3>
                      <p className="text-sm text-[#8d86ad]">
                        {student.college || "Student"}
                      </p>
                    </div>
                  </div>

                  <p className="text-2xl font-black text-white">
                    {student.leetcodeTotalSolved || 0}
                  </p>
                </motion.div>
              ))}

              {leaderboard.length === 0 && (
                <p className="text-sm text-[#8d86ad] text-center py-10">
                  No leaderboard data yet
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[28px] border border-[#6c63ff]/25 bg-[#080711]/85 backdrop-blur-2xl p-7 shadow-2xl shadow-[#6c63ff]/10"
          >
            <div className="absolute -right-24 -top-24 w-72 h-72 bg-[#6c63ff]/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 text-[#8d86ad] text-sm font-bold">
                  <Sparkles size={16} className="text-[#6c63ff]" />
                  Welcome back, {user?.name}
                </div>

                <span className="rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/8 px-4 py-2 text-xs font-black text-[#00d4aa]">
                  Session Active
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                Learn from
                <br />
                <span className="bg-gradient-to-r from-[#00d4aa] via-[#6c63ff] to-[#f5a623] bg-clip-text text-transparent">
                  trainer code.
                </span>
              </h2>

              <p className="text-[#8d86ad] text-base mt-5 max-w-3xl leading-relaxed">
                Practice inside your own compiler. Open assigned templates, work
                in the Arena, apply code patterns and move faster every day.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/8 p-5">
                  <Users className="text-[#00d4aa] mb-3" size={22} />
                  <p className="text-3xl font-black">{onlineUsers.length}</p>
                  <p className="text-xs text-[#8d86ad] mt-1">Active users</p>
                </div>

                <div className="rounded-2xl border border-[#6c63ff]/20 bg-[#6c63ff]/8 p-5">
                  <FolderKanban className="text-[#6c63ff] mb-3" size={22} />
                  <p className="text-3xl font-black">{batches.length}</p>
                  <p className="text-xs text-[#8d86ad] mt-1">Batches</p>
                </div>

                <div className="rounded-2xl border border-[#f5a623]/20 bg-[#f5a623]/8 p-5">
                  <Code2 className="text-[#f5a623] mb-3" size={22} />
                  <p className="text-3xl font-black">Live</p>
                  <p className="text-xs text-[#8d86ad] mt-1">Compiler</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-[#00d4aa]/20 bg-[#080711]/85 backdrop-blur-2xl shadow-2xl shadow-[#00d4aa]/10 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#00d4aa]/20 px-7 py-5">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Bell size={20} className="text-[#00d4aa]" />
                Announcements
              </h3>

              <span className="text-[10px] text-[#00d4aa] px-3 py-1 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/10 font-black">
                3 NEW
              </span>
            </div>

            <div className="p-6 space-y-4">
              {announcements.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20 font-black">
                      {item.tag}
                    </span>
                    <span className="text-xs text-[#8d86ad]">2h ago</span>
                  </div>

                  <h4 className="font-black">{item.title}</h4>
                  <p className="text-sm text-[#8d86ad] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-6">
          <div>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-[11px] font-black mb-3">
                  <FolderKanban size={13} />
                  Workspace Access
                </div>

                <h3 className="text-3xl font-black">Your Batches</h3>
                <p className="text-sm text-[#8d86ad] mt-1">
                  Select a batch and enter access key to open workspace
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {batches.map((batch) => (
                <motion.div
                  key={batch._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const key = prompt("Enter Batch Access Key");

                    if (key === batch.accessKey) {
                      navigate(`/workspace/${batch._id}`);
                    } else {
                      alert("Wrong Access Key");
                    }
                  }}
                  className="cursor-pointer group relative overflow-hidden rounded-[28px] border border-[#00d4aa]/20 bg-[#080711]/85 hover:border-[#00d4aa]/50 backdrop-blur-2xl p-6 transition shadow-xl shadow-black/20 hover:shadow-[#00d4aa]/10"
                >
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#00d4aa]/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-7">
                      <div className="w-14 h-14 rounded-2xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
                        <FolderKanban size={25} className="text-[#00d4aa]" />
                      </div>

                      <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#8d86ad]">
                        Workspace
                      </span>
                    </div>

                    <h2 className="text-2xl font-black mb-3 group-hover:text-[#00d4aa] transition">
                      {batch.batchName}
                    </h2>

                    <p className="text-[#8d86ad] text-sm leading-relaxed min-h-[50px]">
                      {batch.description || "No description added yet."}
                    </p>

                    <div className="mt-7 flex items-center justify-between">
                      <span className="text-xs text-[#8d86ad]">
                        Open secure workspace
                      </span>

                      <span className="w-10 h-10 rounded-2xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] group-hover:translate-x-1 transition">
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {batches.length === 0 && (
                <div className="md:col-span-2 rounded-[28px] border border-white/10 bg-[#080711]/85 p-10 text-center">
                  <FolderKanban
                    className="mx-auto text-[#8d86ad] mb-4"
                    size={34}
                  />
                  <p className="text-[#8d86ad] font-bold">
                    No batches available yet
                  </p>
                  <p className="text-xs text-[#625d7c] mt-2">
                    Trainer-created batches will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-[28px] border border-[#f5a623]/20 bg-[#080711]/85 backdrop-blur-2xl shadow-2xl shadow-[#f5a623]/10 overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#f5a623]/20 px-7 py-5">
                <div>
                  <h3 className="text-xl font-black flex items-center gap-3">
                    <Trophy size={20} className="text-[#f5a623]" />
                    Challenges
                  </h3>

                  <p className="text-xs text-[#8d86ad] mt-1">
                    Trainer contests appear first
                  </p>
                </div>

                <CalendarDays className="text-[#8d86ad]" size={18} />
              </div>

              <div className="space-y-4 max-h-[780px] overflow-y-auto p-6">
                {contests.map((contest) => (
                  <motion.div
                    key={contest._id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="relative rounded-2xl border border-[#f5a623]/20 bg-[#f5a623]/8 p-5 hover:bg-[#f5a623]/12 transition"
                  >
                    {user?.role === "trainer" && (
                      <button
                        onClick={() => deleteContest(contest._id)}
                        className="absolute top-4 right-4 text-red-300 hover:text-red-200 bg-red-400/10 border border-red-300/20 w-8 h-8 rounded-xl flex items-center justify-center"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}

                    <a
                      href={contest.contestLink}
                      target="_blank"
                      rel="noreferrer"
                      className="block pr-10"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5a623] to-orange-500 mb-4 flex items-center justify-center text-black font-black text-xs">
                        {contest.platform.slice(0, 2).toUpperCase()}
                      </div>

                      <p className="text-xs text-[#f5a623] font-bold">
                        Trainer Contest
                      </p>

                      <h4 className="text-base font-black mt-1">
                        {contest.contestName}
                      </h4>

                      <p className="text-xs text-[#8d86ad] mt-2">
                        Batch: {contest.batchName}
                      </p>

                      <p className="text-xs text-[#8d86ad] mt-1">
                        {contest.contestDate} • {contest.contestTime}
                      </p>
                    </a>
                  </motion.div>
                ))}

                {defaultContests.map((contest, index) => (
                  <motion.a
                    key={index}
                    href={contest.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="block rounded-2xl border border-white/10 bg-black/20 hover:bg-white/[0.06] p-5 transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contest.color} mb-4 flex items-center justify-center text-black font-black text-xs`}
                    >
                      {contest.platform.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#8d86ad]">
                          {contest.platform}
                        </p>

                        <h4 className="text-base font-black mt-1">
                          {contest.title}
                        </h4>

                        <p className="text-xs text-[#8d86ad] mt-2">
                          {contest.time}
                        </p>
                      </div>

                      <ExternalLink className="text-[#8d86ad]" size={16} />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative overflow-hidden w-full max-w-[480px] bg-[#080711]/95 border border-[#00d4aa]/25 rounded-[28px] p-7 shadow-2xl shadow-[#00d4aa]/20"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#00d4aa]/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-2">Create Batch</h2>

              <p className="text-xs text-[#8d86ad] mb-6">
                Add a new protected learning workspace.
              </p>

              <input
                type="text"
                placeholder="Batch Name"
                value={batchData.batchName}
                onChange={(e) =>
                  setBatchData({
                    ...batchData,
                    batchName: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-4 outline-none text-sm focus:border-[#00d4aa] transition"
              />

              <input
                type="password"
                placeholder="Batch Access Key"
                value={batchData.accessKey}
                onChange={(e) =>
                  setBatchData({
                    ...batchData,
                    accessKey: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-4 outline-none text-sm focus:border-[#00d4aa] transition"
              />

              <textarea
                placeholder="Description"
                value={batchData.description}
                onChange={(e) =>
                  setBatchData({
                    ...batchData,
                    description: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-6 outline-none h-28 text-sm focus:border-[#00d4aa] transition"
              />

              <div className="flex gap-4">
                <button
                  onClick={createBatch}
                  className="flex-1 bg-[#00d4aa] hover:bg-[#12f0c6] text-black p-4 rounded-2xl text-sm font-black"
                >
                  Create
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/8 hover:bg-white/12 border border-white/10 p-4 rounded-2xl text-sm font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showContestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative overflow-hidden w-full max-w-[520px] bg-[#080711]/95 border border-[#f5a623]/25 rounded-[28px] p-7 shadow-2xl shadow-[#f5a623]/20"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#f5a623]/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-2">Add Contest</h2>

              <p className="text-xs text-[#8d86ad] mb-6">
                Add HackerRank, CodeChef, LeetCode or custom contest for
                students.
              </p>

              <input
                type="text"
                placeholder="Contest Name"
                value={contestData.contestName}
                onChange={(e) =>
                  setContestData({
                    ...contestData,
                    contestName: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-4 outline-none text-sm focus:border-[#f5a623] transition"
              />

              <input
                type="text"
                placeholder="Batch Name"
                value={contestData.batchName}
                onChange={(e) =>
                  setContestData({
                    ...contestData,
                    batchName: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-4 outline-none text-sm focus:border-[#f5a623] transition"
              />

              <input
                type="text"
                placeholder="Platform e.g. HackerRank"
                value={contestData.platform}
                onChange={(e) =>
                  setContestData({
                    ...contestData,
                    platform: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-4 outline-none text-sm focus:border-[#f5a623] transition"
              />

              <input
                type="text"
                placeholder="Contest Link"
                value={contestData.contestLink}
                onChange={(e) =>
                  setContestData({
                    ...contestData,
                    contestLink: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 mb-4 outline-none text-sm focus:border-[#f5a623] transition"
              />

              <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                  type="date"
                  value={contestData.contestDate}
                  onChange={(e) =>
                    setContestData({
                      ...contestData,
                      contestDate: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none text-sm focus:border-[#f5a623] transition"
                />

                <input
                  type="time"
                  value={contestData.contestTime}
                  onChange={(e) =>
                    setContestData({
                      ...contestData,
                      contestTime: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none text-sm focus:border-[#f5a623] transition"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={createContest}
                  className="flex-1 bg-[#f5a623] hover:bg-[#ffb536] text-black p-4 rounded-2xl text-sm font-black"
                >
                  Add Contest
                </button>

                <button
                  onClick={() => setShowContestModal(false)}
                  className="flex-1 bg-white/8 hover:bg-white/12 border border-white/10 p-4 rounded-2xl text-sm font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}