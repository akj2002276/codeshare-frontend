import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import {
  Code2,
  GraduationCap,
  ExternalLink,
  Trophy,
  Sparkles,
  Mail,
  CalendarDays,
  ShieldCheck,
  Rocket,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import API from "../api/axios";

export default function PublicProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchPublicProfile = async () => {
    try {
      const res = await API.get(`/profile/public/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data.profile);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to load public profile");
      console.log(error);
    }
  };

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      alert("Failed to copy profile link");
    }
  };

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-[28px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
            <Rocket className="text-cyan-400" size={34} />
          </div>

          <h1 className="text-2xl font-black mb-3">
            Loading public profile...
          </h1>

          <p className="text-zinc-500 text-sm">
            Please wait while we fetch the coding profile.
          </p>
        </div>
      </div>
    );
  }

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "N/A";

  const lastSync = profile.lastLeetcodeSyncAt
    ? new Date(profile.lastLeetcodeSyncAt).toLocaleString()
    : "Never synced";

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[560px] h-[560px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-[420px] h-[420px] bg-purple-600/5 blur-[130px] rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-7">
          <div>
            <button
              onClick={() => navigate("/leaderboard")}
              className="mb-4 px-4 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft size={15} />
              Leaderboard
            </button>

            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Public Coding Profile
            </h1>

            <p className="text-xs text-zinc-500 mt-1">
              Shareable CodeShareX profile
            </p>
          </div>

          <button
            onClick={copyProfileLink}
            className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-black flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy Profile Link"}
          </button>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 22,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative overflow-hidden rounded-[42px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl p-8 shadow-2xl"
        >
          <div className="absolute -top-28 -right-28 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 blur-3xl rounded-full" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="flex flex-col md:flex-row gap-6">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="w-32 h-32 rounded-[38px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-6xl font-black shadow-2xl shadow-cyan-500/20 shrink-0"
              >
                {profile?.name?.charAt(0)?.toUpperCase()}
              </motion.div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-5xl font-black tracking-tight">
                    {profile.name}
                  </h2>

                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black flex items-center gap-1">
                    <ShieldCheck size={13} />
                    Public Profile
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    {profile.email}
                  </span>

                  <span className="hidden md:block">•</span>

                  <span className="flex items-center gap-2">
                    <GraduationCap size={15} />
                    {profile.college || "College not added"}
                  </span>

                  <span className="hidden md:block">•</span>

                  <span className="flex items-center gap-2">
                    <Code2 size={15} />
                    {profile.batch || "Batch not added"}
                  </span>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mt-5 max-w-3xl">
                  {profile.bio ||
                    "No bio added yet. This student has not written a bio."}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <ProfileMiniLink
                    title="LeetCode"
                    url={profile.leetcodeUrl}
                    color="bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                  />

                  <ProfileMiniLink
                    title="CodeChef"
                    url={profile.codechefUrl}
                    color="bg-purple-500/10 text-purple-300 border-purple-500/20"
                  />

                  <ProfileMiniLink
                    title="GitHub"
                    url={profile.githubUrl}
                    color="bg-zinc-700/30 text-zinc-200 border-zinc-700"
                  />

                  <ProfileMiniLink
                    title="LinkedIn"
                    url={profile.linkedinUrl}
                    color="bg-blue-500/10 text-blue-300 border-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-black/40 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black">
                    LeetCode Summary
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1">
                    Synced coding performance
                  </p>
                </div>

                <Trophy className="text-yellow-400" size={28} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SmallStat
                  label="Total"
                  value={profile.leetcodeTotalSolved || 0}
                  color="text-cyan-400"
                />

                <SmallStat
                  label="Easy"
                  value={profile.leetcodeEasySolved || 0}
                  color="text-green-400"
                />

                <SmallStat
                  label="Medium"
                  value={profile.leetcodeMediumSolved || 0}
                  color="text-yellow-400"
                />

                <SmallStat
                  label="Hard"
                  value={profile.leetcodeHardSolved || 0}
                  color="text-red-400"
                />
              </div>

              <div className="mt-5 pt-5 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">
                  Last LeetCode Sync
                </p>

                <p className="text-xs text-cyan-300 font-bold mt-1">
                  {lastSync}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          <AnimatedStat
            icon={<Trophy size={22} />}
            title="Total Solved"
            value={profile.leetcodeTotalSolved || 0}
            desc="LeetCode"
            color="from-yellow-400 to-orange-500"
          />

          <AnimatedStat
            icon={<Code2 size={22} />}
            title="Easy"
            value={profile.leetcodeEasySolved || 0}
            desc="Solved problems"
            color="from-green-400 to-emerald-500"
          />

          <AnimatedStat
            icon={<Sparkles size={22} />}
            title="Medium"
            value={profile.leetcodeMediumSolved || 0}
            desc="Solved problems"
            color="from-cyan-400 to-blue-500"
          />

          <AnimatedStat
            icon={<CalendarDays size={22} />}
            title="Joined"
            value={joinedDate}
            desc="CodeShareX profile"
            color="from-purple-400 to-pink-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          <ProfileLink
            title="LeetCode"
            url={profile.leetcodeUrl}
            icon={<Code2 />}
            color="from-yellow-400 to-orange-500"
            desc="Competitive programming profile"
          />

          <ProfileLink
            title="CodeChef"
            url={profile.codechefUrl}
            icon={<Code2 />}
            color="from-purple-400 to-pink-500"
            desc="Contest and rating profile"
          />

          <ProfileLink
            title="GitHub"
            url={profile.githubUrl}
            icon={<FaGithub size={24} />}
            color="from-zinc-200 to-white"
            desc="Projects and repositories"
          />

          <ProfileLink
            title="LinkedIn"
            url={profile.linkedinUrl}
            icon={<FaLinkedin size={24} />}
            color="from-blue-400 to-cyan-500"
            desc="Professional identity"
          />
        </div>
      </div>
    </div>
  );
}

function ProfileMiniLink({ title, url, color }) {
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noreferrer"
      className={`px-4 py-2 rounded-full border text-xs font-black flex items-center gap-2 ${color} ${
        !url ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {title}
      <ExternalLink size={12} />
    </a>
  );
}

function SmallStat({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className={`text-3xl font-black ${color}`}>
        {value}
      </p>

      <p className="text-xs text-zinc-500 mt-1">
        {label}
      </p>
    </div>
  );
}

function AnimatedStat({ icon, title, value, desc, color }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -5,
      }}
      className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6 shadow-xl"
    >
      <div
        className={`absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br ${color} opacity-10 blur-3xl rounded-full`}
      />

      <div className="relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-black mb-5`}
        >
          {icon}
        </div>

        <p className="text-3xl font-black">
          {value}
        </p>

        <p className="text-sm font-bold mt-2">
          {title}
        </p>

        <p className="text-xs text-zinc-500 mt-1">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function ProfileLink({ title, url, icon, color, desc }) {
  return (
    <motion.a
      href={url || "#"}
      target="_blank"
      rel="noreferrer"
      whileHover={{
        scale: 1.03,
        y: -5,
      }}
      className={`relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950/80 p-6 transition ${
        !url ? "pointer-events-none opacity-45" : "hover:border-cyan-500/40"
      }`}
    >
      <div
        className={`absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br ${color} opacity-10 blur-3xl rounded-full`}
      />

      <div className="relative z-10">
        <div
          className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-black mb-5`}
        >
          {icon}
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-black">{title}</h3>
          <ExternalLink size={16} className="text-zinc-500" />
        </div>

        <p className="text-xs text-zinc-500 mt-2">
          {desc}
        </p>

        <p className="text-xs text-zinc-600 mt-4 truncate">
          {url || "Not added"}
        </p>
      </div>
    </motion.a>
  );
}