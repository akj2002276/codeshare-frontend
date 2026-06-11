import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Code2,
  Save,
  GraduationCap,
  User,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import API from "../api/axios";

export default function CompleteProfile() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    leetcodeUrl: "",
    codechefUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    college: "",
    batch: "",
    bio: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.profile) {
        setFormData({
          leetcodeUrl: res.data.profile.leetcodeUrl || "",
          codechefUrl: res.data.profile.codechefUrl || "",
          githubUrl: res.data.profile.githubUrl || "",
          linkedinUrl: res.data.profile.linkedinUrl || "",
          college: res.data.profile.college || "",
          batch: res.data.profile.batch || "",
          bio: res.data.profile.bio || "",
        });
      }
    } catch (error) {
      console.log("FETCH PROFILE ERROR:", error);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      await API.post("/profile/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile saved successfully");
      navigate("/profile");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[560px] h-[560px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] bg-blue-600/10 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[36px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <User className="text-cyan-400" size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Complete Your Profile
              </h1>

              <p className="text-sm text-zinc-500 mt-1">
                Add your coding profiles and build your student identity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputBox
              icon={<Code2 size={18} />}
              label="LeetCode Profile URL"
              placeholder="https://leetcode.com/u/username/"
              value={formData.leetcodeUrl}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  leetcodeUrl: value,
                })
              }
            />

            <InputBox
              icon={<Code2 size={18} />}
              label="CodeChef Profile URL"
              placeholder="https://www.codechef.com/users/username"
              value={formData.codechefUrl}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  codechefUrl: value,
                })
              }
            />

            <InputBox
              icon={<FaGithub size={18} />}
              label="GitHub URL"
              placeholder="https://github.com/username"
              value={formData.githubUrl}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  githubUrl: value,
                })
              }
            />

            <InputBox
              icon={<FaLinkedin size={18} />}
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedinUrl}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  linkedinUrl: value,
                })
              }
            />

            <InputBox
              icon={<GraduationCap size={18} />}
              label="College"
              placeholder="Enter your college name"
              value={formData.college}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  college: value,
                })
              }
            />

            <InputBox
              icon={<Code2 size={18} />}
              label="Batch"
              placeholder="Java DSA Batch / MERN Batch"
              value={formData.batch}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  batch: value,
                })
              }
            />
          </div>

          <div className="mt-5">
            <label className="text-xs text-zinc-400 font-bold">
              Bio
            </label>

            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              placeholder="Write something about your coding journey..."
              className="w-full mt-2 h-32 resize-none rounded-2xl bg-zinc-900 border border-zinc-800 p-4 outline-none text-sm focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-bold"
            >
              Back to Dashboard
            </button>

            <button
              onClick={saveProfile}
              disabled={loading}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-sm font-black flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InputBox({ icon, label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-zinc-400 font-bold">
        {label}
      </label>

      <div className="mt-2 flex items-center gap-3 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 focus-within:border-cyan-500">
        <span className="text-cyan-400">{icon}</span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-4 bg-transparent outline-none text-sm"
        />
      </div>
    </div>
  );
}