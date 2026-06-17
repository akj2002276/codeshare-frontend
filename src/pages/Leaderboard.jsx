import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Trophy,
  Medal,
  Crown,
  ExternalLink,
  RefreshCcw,
  ArrowLeft,
  Clock3,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Leaderboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [leaderboard, setLeaderboard] = useState([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      const res = await API.get("/leaderboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LEADERBOARD RESPONSE", res.data);
      setLeaderboard(res.data.leaderboard || []);
      setLastUpdatedAt(res.data.lastUpdatedAt || null);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to fetch leaderboard");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const syncAllLeaderboard = async () => {
    try {
      const confirmSync = window.confirm(
        "This will sync LeetCode stats for all students. Continue?"
      );

      if (!confirmSync) return;

      setSyncingAll(true);

      const res = await API.post(
        "/leaderboard/sync-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLastUpdatedAt(res.data.lastUpdatedAt || new Date().toISOString());

      alert(
        `Leaderboard updated.\nUpdated: ${res.data.updated}\nFailed: ${res.data.failed}`
      );

      fetchLeaderboard();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update leaderboard");
      console.log(error);
    } finally {
      setSyncingAll(false);
    }
  };

  const openPublicProfile = (student) => {
    console.log("CLICKED STUDENT", student);
  const profileId =
    student?.user?._id ||
    student?.user ||
    student?._id;

  if (!profileId) {
    alert("Profile link not available");
    return;
  }

  navigate(`/profile/${profileId}`);
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "Not updated yet";

    return new Date(dateValue).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[560px] h-[560px] bg-yellow-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] bg-cyan-600/10 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 px-4 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft size={15} />
              Dashboard
            </button>

            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-300 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
              Leaderboard
            </h1>

            <p className="text-sm text-zinc-500 mt-2">
              Rankings based on synced LeetCode solved problems.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
              <Clock3 size={15} className="text-cyan-400" />

              <span className="text-xs text-zinc-400">
                Last Updated:
              </span>

              <span className="text-xs font-black text-cyan-300">
                {formatDateTime(lastUpdatedAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "trainer" && (
              <button
                onClick={syncAllLeaderboard}
                disabled={syncingAll}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-black flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCcw size={16} />
                {syncingAll ? "Updating..." : "Update Leaderboard"}
              </button>
            )}

            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="px-5 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-black flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCcw size={16} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative overflow-hidden rounded-[40px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-zinc-950 to-cyan-500/10 backdrop-blur-xl p-8 shadow-2xl mb-8"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-yellow-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-black mb-5">
                <Trophy size={14} />
                CodeShareX Ranking System
              </div>

              <h2 className="text-3xl font-black leading-tight">
                Compete with your batchmates.
                <br />
                Improve your coding consistency.
              </h2>

              <p className="text-sm text-zinc-500 mt-4 max-w-2xl leading-relaxed">
                Students are ranked by total LeetCode solved count. Hard and
                medium problems are used as tie breakers. Click any student to
                open their public profile.
              </p>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-black/40 p-6 min-w-[220px]">
              <p className="text-4xl font-black text-yellow-300">
                {leaderboard.length}
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                Students on leaderboard
              </p>

              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-500">
                  Last Updated
                </p>

                <p className="text-xs text-cyan-300 font-bold mt-1">
                  {formatDateTime(lastUpdatedAt)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {leaderboard.length === 0 && (
          <div className="rounded-[36px] border border-zinc-800 bg-zinc-950/80 p-10 text-center">
            <Trophy className="mx-auto text-zinc-600 mb-4" size={42} />

            <h2 className="text-2xl font-black">
              No leaderboard data yet
            </h2>

            <p className="text-sm text-zinc-500 mt-2">
              Students need to complete profile and sync LeetCode stats.
            </p>
          </div>
        )}

        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {topThree.map((student, index) => (
              <TopRankCard
                key={student._id}
                student={student}
                index={index}
                onClick={() => openPublicProfile(student)}
              />
            ))}
          </div>
        )}

        {others.length > 0 && (
          <div className="rounded-[36px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Full Ranking
                </h2>

                <p className="text-xs text-zinc-500 mt-1">
                  Last updated: {formatDateTime(lastUpdatedAt)}
                </p>
              </div>

              <Medal className="text-yellow-400" />
            </div>

            <div className="divide-y divide-zinc-800">
              {others.map((student) => (
                <motion.div
                  key={student._id}
                  onClick={() => openPublicProfile(student)}
                  whileHover={{
                    backgroundColor: "rgba(39,39,42,0.35)",
                  }}
                  className="cursor-pointer grid grid-cols-[80px_1.4fr_1fr_1fr_140px] gap-4 items-center px-5 py-4"
                >
                  <div className="text-2xl font-black text-zinc-500">
                    #{student.rank}
                  </div>

                  <div>
                    <h3 className="font-black hover:text-cyan-300 transition">
                      {student.name}
                    </h3>

                    <p className="text-xs text-zinc-500 mt-1">
                      {student.college || "College not added"} •{" "}
                      {student.batch || "Batch not added"}
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-black text-cyan-400">
                      {student.leetcodeTotalSolved || 0}
                    </p>

                    <p className="text-xs text-zinc-500">
                      Total solved
                    </p>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <StatPill label="E" value={student.leetcodeEasySolved} />
                    <StatPill label="M" value={student.leetcodeMediumSolved} />
                    <StatPill label="H" value={student.leetcodeHardSolved} />
                  </div>

                  <div
                    className="flex justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {student.githubUrl && (
                      <a
                        href={student.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center"
                      >
                        <FaGithub size={15} />
                      </a>
                    )}

                    {student.linkedinUrl && (
                      <a
                        href={student.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center"
                      >
                        <FaLinkedin size={15} />
                      </a>
                    )}

                    {student.leetcodeUsername && (
                      <a
                        href={`https://leetcode.com/u/${student.leetcodeUsername}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TopRankCard({
  student,
  index,
  onClick,
}) {
  const colors = [
    {
      border: "border-yellow-500/30",
      bg: "from-yellow-500/20 to-orange-500/5",
      icon: "from-yellow-300 to-orange-500",
      title: "Champion",
    },
    {
      border: "border-zinc-400/30",
      bg: "from-zinc-300/15 to-zinc-700/5",
      icon: "from-zinc-200 to-zinc-500",
      title: "Runner Up",
    },
    {
      border: "border-orange-500/30",
      bg: "from-orange-500/15 to-red-500/5",
      icon: "from-orange-300 to-red-500",
      title: "Top Performer",
    },
  ];

  const item = colors[index];

  return (
    <motion.div
      onClick={onClick}
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.08,
      }}
      whileHover={{
        scale: 1.03,
        y: -6,
      }}
      className={`cursor-pointer relative overflow-hidden rounded-[36px] border ${item.border} bg-gradient-to-br ${item.bg} backdrop-blur-xl p-6 shadow-2xl`}
    >
      <div className="absolute -top-20 -right-20 w-52 h-52 bg-yellow-500/10 blur-3xl rounded-full" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div
            className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${item.icon} text-black flex items-center justify-center shadow-xl`}
          >
            {index === 0 ? (
              <Crown size={30} />
            ) : (
              <Medal size={30} />
            )}
          </div>

          <span className="text-4xl font-black text-white/20">
            #{student.rank}
          </span>
        </div>

        <p className="text-xs text-yellow-300 font-black mb-2">
          {item.title}
        </p>

        <h3 className="text-2xl font-black hover:text-cyan-300 transition">
          {student.name}
        </h3>

        <p className="text-xs text-zinc-500 mt-2">
          {student.college || "College not added"}
        </p>

        <div className="mt-6 rounded-3xl border border-zinc-800 bg-black/40 p-5">
          <p className="text-4xl font-black text-cyan-400">
            {student.leetcodeTotalSolved || 0}
          </p>

          <p className="text-xs text-zinc-500 mt-1">
            Total LeetCode Solved
          </p>

          <div className="flex gap-2 mt-4">
            <StatPill label="Easy" value={student.leetcodeEasySolved} />
            <StatPill label="Medium" value={student.leetcodeMediumSolved} />
            <StatPill label="Hard" value={student.leetcodeHardSolved} />
          </div>
        </div>

        <div
          className="flex gap-2 mt-5"
          onClick={(e) => e.stopPropagation()}
        >
          {student.githubUrl && (
            <a
              href={student.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <FaGithub size={14} />
              GitHub
            </a>
          )}

          {student.linkedinUrl && (
            <a
              href={student.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <FaLinkedin size={14} />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
      <span className="text-zinc-500">{label}: </span>
      <span className="font-black text-white">{value || 0}</span>
    </div>
  );
}