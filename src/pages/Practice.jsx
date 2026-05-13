import { useState } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";

import {
  FiPlay,
  FiCopy,
  FiMoon,
  FiSun,
  FiZoomIn,
  FiZoomOut,
  FiRotateCcw,
  FiTerminal,
  FiCode,
  FiCpu,
} from "react-icons/fi";

import API from "../api/axios";

const boilerplates = {
  javascript: `console.log("Hello CodeShareX");`,

  python: `print("Hello CodeShareX")`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello CodeShareX" << endl;
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello CodeShareX");
    }
}`,
};

const extensions = {
  javascript: "js",
  python: "py",
  cpp: "cpp",
  java: "java",
};

const languages = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "JS",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "python",
    name: "Python",
    icon: "PY",
    color: "from-blue-400 to-yellow-400",
  },
  {
    id: "java",
    name: "Java",
    icon: "JV",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "cpp",
    name: "C++",
    icon: "C++",
    color: "from-blue-500 to-cyan-400",
  },
];

export default function Practice() {
  const token = localStorage.getItem("token");

  const [language, setLanguage] = useState("java");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [code, setCode] = useState(boilerplates.java);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [rightWidth, setRightWidth] = useState(36);
  const [inputHeight, setInputHeight] = useState(44);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(boilerplates[value]);
    setInput("");
    setOutput("");
  };

  const runCode = async () => {
    try {
      if (!code.trim()) return alert("Code is empty");

      setRunning(true);
      setOutput("Running...");

      const response = await API.post(
        "/compiler/run",
        {
          code,
          language,
          input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOutput(response.data.output || "No Output");
    } catch (error) {
      setOutput(
        JSON.stringify(
          error?.response?.data || error.message,
          null,
          2
        )
      );
    } finally {
      setRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code Copied");
  };

  const resetCode = () => {
    setCode(boilerplates[language]);
    setInput("");
    setOutput("");
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full" />

      {/* LANGUAGE SIDEBAR */}
      <aside className="relative z-10 w-24 bg-zinc-950/90 border-r border-zinc-800 flex flex-col items-center py-5 gap-5">

        <div className="w-12 h-12 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <FiCpu className="text-cyan-400" size={22} />
        </div>

        <div className="w-10 h-[1px] bg-zinc-800" />

        <div className="flex flex-col gap-4">
          {languages.map((lang) => (
            <motion.button
              key={lang.id}
              whileHover={{
                scale: 1.08,
                y: -2,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() => handleLanguageChange(lang.id)}
              title={lang.name}
              className={`relative w-14 h-14 rounded-3xl flex items-center justify-center font-black text-sm transition border ${
                language === lang.id
                  ? "border-cyan-400 bg-cyan-500/10 shadow-xl shadow-cyan-500/20"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <span
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${lang.color} opacity-${
                  language === lang.id ? "20" : "0"
                }`}
              />

              <span className="relative z-10">
                {lang.icon}
              </span>

              {language === lang.id && (
                <span className="absolute -right-2 w-2 h-8 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />
              )}
            </motion.button>
          ))}
        </div>

      </aside>

      {/* MAIN AREA */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <div className="h-16 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-between px-5">

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <div>
                <h1 className="text-lg font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Practice Arena
                </h1>
                <p className="text-xs text-zinc-500">
                  main.{extensions[language]} • {languages.find((l) => l.id === language)?.name}
                </p>
              </div>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={runCode}
              disabled={running}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition font-bold flex items-center gap-2 disabled:opacity-50 text-sm shadow-lg shadow-green-500/20"
            >
              <FiPlay />
              {running ? "Running..." : "Run Code"}
            </button>

            <button
              onClick={copyCode}
              className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              title="Copy Code"
            >
              <FiCopy />
            </button>

            <button
              onClick={resetCode}
              className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              title="Reset Code"
            >
              <FiRotateCcw />
            </button>

            <button
              onClick={() => setFontSize((prev) => Math.min(prev + 1, 24))}
              className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              title="Zoom In"
            >
              <FiZoomIn />
            </button>

            <button
              onClick={() => setFontSize((prev) => Math.max(prev - 1, 11))}
              className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              title="Zoom Out"
            >
              <FiZoomOut />
            </button>

            <button
              onClick={() =>
                setTheme(theme === "vs-dark" ? "light" : "vs-dark")
              }
              className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              title="Toggle Theme"
            >
              {theme === "vs-dark" ? <FiSun /> : <FiMoon />}
            </button>

          </div>

        </div>

        {/* WORKSPACE BODY */}
        <div className="flex-1 flex overflow-hidden p-4 gap-0">

          {/* EDITOR PANEL */}
          <section
            className="h-full rounded-l-[28px] overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl"
            style={{
              width: `${100 - rightWidth}%`,
            }}
          >
            <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/70">

              <div className="flex items-center gap-3">
                <FiCode className="text-cyan-400" />
                <span className="text-sm font-semibold text-zinc-300">
                  Editor
                </span>
              </div>

              <span className="text-xs text-zinc-500">
                Monaco Powered
              </span>

            </div>

            <div className="h-[calc(100%-48px)]">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize,
                  minimap: {
                    enabled: false,
                  },
                  wordWrap: "on",
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                  padding: {
                    top: 18,
                  },
                }}
              />
            </div>
          </section>

          {/* HORIZONTAL RESIZE */}
          <div
            className="w-2 cursor-col-resize flex items-center justify-center group"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = rightWidth;

              const handleMouseMove = (moveEvent) => {
                const diff = moveEvent.clientX - startX;
                const percentageDiff = (diff / window.innerWidth) * 100;

                let newRightWidth = startWidth - percentageDiff;

                if (newRightWidth < 26) newRightWidth = 26;
                if (newRightWidth > 55) newRightWidth = 55;

                setRightWidth(newRightWidth);
              };

              const handleMouseUp = () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
              };

              window.addEventListener("mousemove", handleMouseMove);
              window.addEventListener("mouseup", handleMouseUp);
            }}
          >
            <div className="w-1 h-16 rounded-full bg-zinc-800 group-hover:bg-cyan-400 transition" />
          </div>

          {/* INPUT OUTPUT PANEL */}
          <section
            className="h-full rounded-r-[28px] overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col"
            style={{
              width: `${rightWidth}%`,
            }}
          >

            {/* INPUT */}
            <div
              className="flex flex-col"
              style={{
                height: `${inputHeight}%`,
              }}
            >
              <div className="h-12 flex items-center justify-between px-4 bg-zinc-900/70 border-b border-zinc-800">

                <div className="flex items-center gap-2">
                  <FiTerminal className="text-cyan-400" />
                  <h3 className="font-semibold text-sm">
                    Input
                  </h3>
                </div>

                <span className="text-xs text-zinc-500">
                  stdin
                </span>

              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here..."
                className="flex-1 resize-none outline-none bg-zinc-950 text-zinc-300 text-sm p-4 font-mono"
              />
            </div>

            {/* VERTICAL RESIZE */}
            <div
              className="h-2 cursor-row-resize flex items-center justify-center group border-y border-zinc-800"
              onMouseDown={(e) => {
                const startY = e.clientY;
                const startHeight = inputHeight;

                const handleMouseMove = (moveEvent) => {
                  const diff = moveEvent.clientY - startY;
                  const percentageDiff = (diff / window.innerHeight) * 100;

                  let newHeight = startHeight + percentageDiff;

                  if (newHeight < 24) newHeight = 24;
                  if (newHeight > 75) newHeight = 75;

                  setInputHeight(newHeight);
                };

                const handleMouseUp = () => {
                  window.removeEventListener("mousemove", handleMouseMove);
                  window.removeEventListener("mouseup", handleMouseUp);
                };

                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div className="h-1 w-16 rounded-full bg-zinc-800 group-hover:bg-cyan-400 transition" />
            </div>

            {/* OUTPUT */}
            <div className="flex-1 flex flex-col">
              <div className="h-12 flex items-center justify-between px-4 bg-zinc-900/70 border-b border-zinc-800">

                <div className="flex items-center gap-2">
                  <FiTerminal className="text-green-400" />
                  <h3 className="font-semibold text-sm">
                    Output
                  </h3>
                </div>

                <span className="text-xs text-zinc-500">
                  terminal
                </span>

              </div>

              <pre className="flex-1 overflow-auto bg-black text-green-400 text-sm p-4 font-mono whitespace-pre-wrap">
                {output || "Output will appear here..."}
              </pre>
            </div>

          </section>

        </div>

      </main>

    </div>
  );
}