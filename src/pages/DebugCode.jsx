import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

import {
  FiSend,
  FiCode,
  FiCopy,
  FiRefreshCcw,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import API from "../api/axios";

const boilerplates = {
  javascript: `console.log("Paste your code here");`,

  python: `print("Paste your code here")`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Paste your code here" << endl;
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Paste your code here");
    }
}`,
};

export default function DebugCode() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [language, setLanguage] = useState("java");
  const [title, setTitle] = useState("");
  const [doubt, setDoubt] = useState("");
  const [code, setCode] = useState(boilerplates.java);

  const [loading, setLoading] = useState(false);
  const [myTickets, setMyTickets] = useState([]);

  const fetchMyTickets = async () => {
    try {
      const res = await API.get("/tickets/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyTickets(res.data || []);
    } catch (error) {
      console.log("FETCH MY TICKETS ERROR:", error);
    }
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(boilerplates[value]);
  };

  const raiseTicket = async () => {
    try {
      if (!title.trim()) return alert("Enter ticket title");
      if (!doubt.trim()) return alert("Explain your doubt");
      if (!code.trim()) return alert("Paste your code");

      setLoading(true);

      await API.post(
        "/tickets",
        {
          title,
          language,
          doubt,
          originalCode: code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Ticket raised successfully");

      setTitle("");
      setDoubt("");
      setCode(boilerplates[language]);

      fetchMyTickets();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to raise ticket");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const copyResolvedCode = (resolvedCode) => {
    navigator.clipboard.writeText(resolvedCode);
    alert("Resolved code copied");
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-blue-600/10 blur-[150px] rounded-full" />

      <div className="relative z-10 p-6 h-screen flex flex-col">
        {/* TOP */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FiCode className="text-cyan-400" size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Debug My Code
              </h1>

              <p className="text-xs text-zinc-500">
                Raise code doubts and get trainer-reviewed solutions
              </p>
            </div>
          </div>

          <div className="text-xs text-zinc-500">
            Logged in as {user?.name}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[1.35fr_0.8fr] gap-5 overflow-hidden">
          {/* LEFT EDITOR PANEL */}
          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl">
            <div className="h-14 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />

                <span className="ml-3 text-xs text-zinc-400">
                  student-debug.{language === "cpp" ? "cpp" : language === "python" ? "py" : language === "java" ? "java" : "js"}
                </span>
              </div>

              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div className="flex-1">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 18 },
                }}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col gap-5 overflow-hidden">
            {/* RAISE TICKET */}
            <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-5 shadow-2xl">
              <h2 className="text-lg font-black mb-1">Raise Doubt Ticket</h2>

              <p className="text-xs text-zinc-500 mb-5">
                Explain what is not working. Trainer will resolve your code.
              </p>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short title e.g. Array loop bug"
                className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-cyan-500"
              />

              <textarea
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
                placeholder="Explain your doubt clearly..."
                className="w-full h-32 resize-none p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-cyan-500"
              />

              <button
                onClick={raiseTicket}
                disabled={loading}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiSend />
                {loading ? "Raising Ticket..." : "Raise Your Doubt"}
              </button>
            </div>

            {/* MY TICKETS */}
            <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-5 shadow-2xl flex-1 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black">My Tickets</h2>
                  <p className="text-xs text-zinc-500">
                    Resolved code will appear here
                  </p>
                </div>

                <button
                  onClick={fetchMyTickets}
                  className="p-2 rounded-xl hover:bg-zinc-800 border border-zinc-800"
                >
                  <FiRefreshCcw />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto h-full pr-1 pb-10">
                {myTickets.length === 0 && (
                  <p className="text-sm text-zinc-600 mt-10 text-center">
                    No tickets raised yet
                  </p>
                )}

                {myTickets.map((ticket) => (
                  <motion.div
                    key={ticket._id}
                    whileHover={{ x: 3 }}
                    className={`rounded-2xl border p-4 ${
                      ticket.status === "resolved"
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-yellow-500/20 bg-yellow-500/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold">{ticket.title}</h3>

                      <span
                        className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${
                          ticket.status === "resolved"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-300"
                        }`}
                      >
                        {ticket.status === "resolved" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiClock />
                        )}
                        {ticket.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 mb-2">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {ticket.doubt}
                    </p>

                    {ticket.status === "resolved" && (
                      <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 p-3">
                        <p className="text-xs text-green-400 font-bold mb-2">
                          Trainer Feedback
                        </p>

                        <p className="text-xs text-zinc-400 mb-3">
                          {ticket.trainerFeedback || "Resolved by trainer"}
                        </p>

                        <button
                          onClick={() => copyResolvedCode(ticket.resolvedCode)}
                          className="text-xs px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 font-bold flex items-center gap-2"
                        >
                          <FiCopy />
                          Copy Resolved Code
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}