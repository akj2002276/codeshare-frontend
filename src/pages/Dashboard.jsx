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

      const data = response.data || [];

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <div className="relative z-10 px-8 py-7">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Code2 className="text-cyan-400" size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                codeshareX
              </h1>

              <p className="text-xs text-zinc-500">
                Premium coding workspace for Coding Thinker students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open("/practice", "_blank")}
              className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-cyan-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10 w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/20 flex items-center justify-center">
                <Zap className="text-cyan-300" size={16} />
              </div>

              <div className="relative z-10 flex flex-col items-start">
                <span className="text-white text-xs leading-none">
                  Playground
                </span>

                <span className="text-zinc-400 text-[10px] mt-1">
                  Run Code
                </span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/profile")}
              className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-blue-500/10"
            >
              <div className="relative z-10 w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center">
                <UserCircle className="text-blue-300" size={16} />
              </div>

              <div className="relative z-10 flex flex-col items-start">
                <span className="text-white text-xs leading-none">
                  Profile
                </span>

                <span className="text-zinc-400 text-[10px] mt-1">
                  Coding Identity
                </span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/leaderboard")}
              className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-yellow-500/10"
            >
              <div className="relative z-10 w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-400/20 flex items-center justify-center">
                <Trophy className="text-yellow-300" size={16} />
              </div>

              <div className="relative z-10 flex flex-col items-start">
                <span className="text-white text-xs leading-none">
                  Leaderboard
                </span>

                <span className="text-zinc-400 text-[10px] mt-1">
                  Rankings
                </span>
              </div>
            </motion.button>

            {user?.role === "student" && (
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open("/debug", "_blank")}
                className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-purple-500/10"
              >
                <div className="relative z-10 w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/20 flex items-center justify-center">
                  <Bug className="text-purple-300" size={16} />
                </div>

                <div className="relative z-10 flex flex-col items-start">
                  <span className="text-white text-xs leading-none">
                    Debug Code
                  </span>

                  <span className="text-zinc-400 text-[10px] mt-1">
                    Raise Doubt
                  </span>
                </div>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open("/community", "_blank")}
              className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-cyan-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10 w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/20 flex items-center justify-center">
                <Users className="text-cyan-300" size={16} />
              </div>

              <div className="relative z-10 flex flex-col items-start">
                <span className="text-white text-xs leading-none">
                  Community
                </span>

                <span className="text-zinc-400 text-[10px] mt-1">
                  Join Chat Room
                </span>
              </div>

              <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            </motion.button>

            {user?.role === "trainer" && (
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open("/tickets", "_blank")}
                className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-purple-500/10"
              >
                <div className="relative z-10 w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/20 flex items-center justify-center">
                  <TicketCheck className="text-purple-300" size={16} />
                </div>

                <div className="relative z-10 flex flex-col items-start">
                  <span className="text-white text-xs leading-none">
                    Active Tickets
                  </span>

                  <span className="text-zinc-400 text-[10px] mt-1">
                    Resolve Doubts
                  </span>
                </div>
              </motion.button>
            )}

            {user?.role === "trainer" && (
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open("/live", "_blank")}
                className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-orange-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-red-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-400/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative z-10 w-8 h-8 rounded-xl bg-red-500/20 border border-red-400/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                </div>

                <div className="relative z-10 flex flex-col items-start">
                  <span className="text-white text-xs leading-none">
                    Live Code
                  </span>

                  <span className="text-zinc-400 text-[10px] mt-1">
                    Share Live
                  </span>
                </div>
              </motion.button>
            )}

            {user?.role === "student" && (
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open("/live", "_blank")}
                className="relative overflow-hidden group px-5 py-3 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-600/10 backdrop-blur-xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-green-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-400/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative z-10 w-8 h-8 rounded-xl bg-green-500/20 border border-green-400/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="relative z-10 flex flex-col items-start">
                  <span className="text-white text-xs leading-none">
                    Open Live
                  </span>

                  <span className="text-zinc-400 text-[10px] mt-1">
                    Watch Trainer
                  </span>
                </div>
              </motion.button>
            )}

            {user?.role === "trainer" && (
              <>
                <button
                  onClick={() => setShowContestModal(true)}
                  className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold transition"
                >
                  <Trophy size={16} />
                  Contest
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold transition"
                >
                  <Plus size={16} />
                  Batch
                </button>
              </>
            )}

            <button
              onClick={logout}
              className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {user?.role === "student" && !profileCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-xl p-6 shadow-2xl shadow-cyan-500/10"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <UserCircle className="text-cyan-400" size={26} />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Complete Your Coding Profile
                  </h2>

                  <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                    Add your LeetCode, CodeChef, GitHub and LinkedIn profiles.
                    This will unlock your student profile and future leaderboard ranking.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/complete-profile")}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-sm font-black shadow-xl shadow-cyan-500/20"
              >
                Complete Now
              </button>
            </div>
          </motion.div>
        )}

        {user?.role === "student" && profileCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative overflow-hidden rounded-[32px] border border-green-500/20 bg-green-500/5 backdrop-blur-xl p-6"
          >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={26} />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Your Coding Profile is Ready
                  </h2>

                  <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                    {profile?.college || "College not added"} •{" "}
                    {profile?.batch || "Batch not added"} • LeetCode, GitHub and LinkedIn connected.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="px-7 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-sm font-black"
              >
                View Profile
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-xl p-6"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-500/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Crown className="text-yellow-300" size={28} />
                </div>

                <div>
                  <h2 className="text-xl font-black">Your Rank</h2>

                  <p className="text-xs text-zinc-500">
                    LeetCode Leaderboard
                  </p>
                </div>
              </div>

              <h1 className="text-7xl font-black text-yellow-300">
                {myRank ? `#${myRank.rank}` : "--"}
              </h1>

              <p className="text-zinc-400 mt-3">
                {myRank
                  ? `${myRank.leetcodeTotalSolved || 0} Problems Solved`
                  : "Sync your LeetCode profile"}
              </p>

              <button
                onClick={() => navigate("/leaderboard")}
                className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black p-4 rounded-2xl font-black"
              >
                View Full Rankings
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black">Top 5 Students</h2>

                <p className="text-xs text-zinc-500">
                  Live leaderboard
                </p>
              </div>

              <Medal className="text-yellow-400" />
            </div>

            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((student) => (
                <motion.div
                  key={student._id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`rounded-2xl p-4 border ${
                    student.email === user?.email
                      ? "border-cyan-500/40 bg-cyan-500/10"
                      : "border-zinc-800 bg-black/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                          student.rank === 1
                            ? "bg-yellow-500 text-black"
                            : student.rank === 2
                            ? "bg-zinc-300 text-black"
                            : student.rank === 3
                            ? "bg-orange-500 text-black"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}
                      >
                        #{student.rank}
                      </div>

                      <div>
                        <h3 className="font-bold">{student.name}</h3>

                        <p className="text-xs text-zinc-500">
                          {student.college || "Student"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black text-cyan-400">
                        {student.leetcodeTotalSolved || 0}
                      </p>

                      <p className="text-[10px] text-zinc-500">solved</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {leaderboard.length === 0 && (
                <p className="text-sm text-zinc-600 text-center py-8">
                  No leaderboard data yet
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-8"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-5">
                <Sparkles size={14} />
                Welcome back, {user?.name}
              </div>

              <h2 className="text-4xl font-black tracking-tight leading-tight">
                Learn from trainer code.
                <br />
                Practice inside your own compiler.
              </h2>

              <p className="text-zinc-500 text-sm mt-4 max-w-2xl leading-relaxed">
                Open your assigned batches, read structured code files, and jump into
                the Practice Arena whenever you want to test your own logic.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
                  <Users className="text-green-400 mb-3" size={22} />
                  <p className="text-2xl font-black">{onlineUsers.length}</p>
                  <p className="text-xs text-zinc-500 mt-1">Active users</p>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
                  <FolderKanban className="text-cyan-400 mb-3" size={22} />
                  <p className="text-2xl font-black">{batches.length}</p>
                  <p className="text-xs text-zinc-500 mt-1">Available batches</p>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
                  <Code2 className="text-blue-400 mb-3" size={22} />
                  <p className="text-2xl font-black">Live</p>
                  <p className="text-xs text-zinc-500 mt-1">Practice compiler</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Bell size={18} className="text-cyan-400" />
                  Announcements
                </h3>

                <p className="text-xs text-zinc-500 mt-1">
                  Latest updates for students
                </p>
              </div>

              <span className="text-[10px] text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10">
                Live Board
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  className="rounded-2xl border border-zinc-800 bg-black/40 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold">Your Batches</h3>
                <p className="text-xs text-zinc-500 mt-1">
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
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const key = prompt("Enter Batch Access Key");

                    if (key === batch.accessKey) {
                      navigate(`/workspace/${batch._id}`);
                    } else {
                      alert("Wrong Access Key");
                    }
                  }}
                  className="cursor-pointer relative overflow-hidden rounded-[28px] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-6 hover:border-cyan-500/60 transition-all"
                >
                  <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 blur-3xl rounded-full" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                        <FolderKanban size={25} className="text-cyan-400" />
                      </div>

                      <span className="text-[10px] px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">
                        Workspace
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2">
                      {batch.batchName}
                    </h2>

                    <p className="text-zinc-500 text-sm leading-relaxed min-h-[45px]">
                      {batch.description || "No description added yet."}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        Open secure workspace
                      </span>

                      <span className="text-cyan-400 text-lg">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-400" />
                    Upcoming Coding Challenges
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1">
                    Trainer contests appear first
                  </p>
                </div>

                <CalendarDays className="text-zinc-500" size={18} />
              </div>

              <div className="space-y-4">
                {contests.map((contest) => (
                  <motion.div
                    key={contest._id}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="relative rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5 hover:border-yellow-500/50 transition"
                  >
                    {user?.role === "trainer" && (
                      <button
                        onClick={() => deleteContest(contest._id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}

                    <a
                      href={contest.contestLink}
                      target="_blank"
                      rel="noreferrer"
                      className="block pr-8"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 mb-4 flex items-center justify-center text-black font-black text-xs">
                        {contest.platform.slice(0, 2).toUpperCase()}
                      </div>

                      <p className="text-xs text-yellow-300 font-semibold">
                        Trainer Contest
                      </p>

                      <h4 className="text-sm font-bold mt-1">
                        {contest.contestName}
                      </h4>

                      <p className="text-xs text-zinc-500 mt-2">
                        Batch: {contest.batchName}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">
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
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="block rounded-3xl border border-zinc-800 bg-black/40 p-5 hover:border-cyan-500/50 transition"
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${contest.color} mb-4 flex items-center justify-center text-black font-black text-xs`}
                    >
                      {contest.platform.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-zinc-500">
                          {contest.platform}
                        </p>

                        <h4 className="text-sm font-bold mt-1">
                          {contest.title}
                        </h4>

                        <p className="text-xs text-zinc-500 mt-2">
                          {contest.time}
                        </p>
                      </div>

                      <ExternalLink className="text-zinc-500" size={16} />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-[460px] bg-zinc-950 border border-zinc-800 rounded-[32px] p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-black mb-2">Create Batch</h2>

            <p className="text-xs text-zinc-500 mb-6">
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
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-cyan-500"
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
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-cyan-500"
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
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 outline-none h-28 text-sm focus:border-cyan-500"
            />

            <div className="flex gap-4">
              <button
                onClick={createBatch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl text-sm font-bold"
              >
                Create
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showContestModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-[500px] bg-zinc-950 border border-zinc-800 rounded-[32px] p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-black mb-2">Add Contest</h2>

            <p className="text-xs text-zinc-500 mb-6">
              Add HackerRank, CodeChef, LeetCode or custom contest for students.
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
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-yellow-500"
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
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-yellow-500"
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
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-yellow-500"
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
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-yellow-500"
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
                className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none text-sm focus:border-yellow-500"
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
                className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none text-sm focus:border-yellow-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={createContest}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black p-4 rounded-2xl text-sm font-black"
              >
                Add Contest
              </button>

              <button
                onClick={() => setShowContestModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}