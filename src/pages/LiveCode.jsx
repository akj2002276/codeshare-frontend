import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

import {
  FiPlay,
  FiCopy,
  FiMoon,
  FiSun,
  FiRotateCcw,
  FiTerminal,
  FiCode,
  FiRadio,
  FiWifi,
} from "react-icons/fi";

import API from "../api/axios";
import socket from "../socket";

const boilerplates = {
  javascript: `console.log("Welcome to Live Code Share");`,

  python: `print("Welcome to Live Code Share")`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Welcome to Live Code Share" << endl;
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Live Code Share");
    }
}`,
};

const extensions = {
  javascript: "js",
  python: "py",
  cpp: "cpp",
  java: "java",
};

export default function LiveCode() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isTrainer = user?.role === "trainer";

  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(boilerplates.javascript);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const handleCodeChange = (value) => {
    const newCode = value || "";
    setCode(newCode);

    if (isTrainer) {
      socket.emit("live-code-change", newCode);
    }
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(boilerplates[value]);
    setInput("");
    setOutput("");

    if (isTrainer) {
      socket.emit("live-language-change", value);
      socket.emit("live-code-change", boilerplates[value]);
      socket.emit("live-input-change", "");
      socket.emit("live-output-change", "");
    }
  };

  const handleInputChange = (value) => {
    setInput(value);

    if (isTrainer) {
      socket.emit("live-input-change", value);
    }
  };

  const runCode = async () => {
    try {
      if (!isTrainer) return;
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

      const result = response.data.output || "No Output";
      setOutput(result);
      socket.emit("live-output-change", result);
    } catch (error) {
      const err = JSON.stringify(
        error?.response?.data || error.message,
        null,
        2
      );

      setOutput(err);
      socket.emit("live-output-change", err);
    } finally {
      setRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code Copied");
  };

  const resetLive = () => {
    if (!isTrainer) return;

    setLanguage("javascript");
    setCode(boilerplates.javascript);
    setInput("");
    setOutput("");
    setIsLive(false);

    socket.emit("live-reset");
  };

  const startLive = () => {
    if (!isTrainer) return;

    setIsLive(true);
    socket.emit("live-start");
    socket.emit("live-code-change", code);
    socket.emit("live-language-change", language);
    socket.emit("live-input-change", input);
    socket.emit("live-output-change", output);
  };

  const stopLive = () => {
    if (!isTrainer) return;

    setIsLive(false);
    socket.emit("live-stop");
  };

  useEffect(() => {
    socket.on("live-code-state", (state) => {
      setCode(state.code);
      setLanguage(state.language);
      setInput(state.input);
      setOutput(state.output);
      setIsLive(state.isLive);
    });

    socket.on("live-code-update", (newCode) => {
      if (!isTrainer) {
        setCode(newCode);
      }
    });

    socket.on("live-language-update", (newLanguage) => {
      setLanguage(newLanguage);
    });

    socket.on("live-input-update", (newInput) => {
      if (!isTrainer) {
        setInput(newInput);
      }
    });

    socket.on("live-output-update", (newOutput) => {
      setOutput(newOutput);
    });

    return () => {
      socket.off("live-code-state");
      socket.off("live-code-update");
      socket.off("live-language-update");
      socket.off("live-input-update");
      socket.off("live-output-update");
    };
  }, [isTrainer]);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full" />

      {/* TOPBAR */}
      <div className="relative z-10 h-16 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FiRadio className="text-cyan-400" />
          </div>

          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Live Code Share
            </h1>

            <p className="text-xs text-zinc-500">
              {isTrainer
                ? "Trainer live coding mode"
                : "Student live viewing mode"}
            </p>
          </div>

          <div className="ml-3 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-semibold">
              {isLive ? "Live Now" : "Waiting"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isTrainer && (
            <>
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

              {!isLive ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={startLive}
                  className="px-5 py-2 rounded-2xl bg-green-600 hover:bg-green-700 font-bold text-sm flex items-center gap-2"
                >
                  <FiWifi />
                  Start Live
                </motion.button>
              ) : (
                <button
                  onClick={stopLive}
                  className="px-5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 font-bold text-sm"
                >
                  Stop Live
                </button>
              )}

              <button
                onClick={runCode}
                disabled={running}
                className="px-5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-bold text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <FiPlay />
                {running ? "Running..." : "Run"}
              </button>

              <button
                onClick={resetLive}
                className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              >
                <FiRotateCcw />
              </button>
            </>
          )}

          <button
            onClick={copyCode}
            className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
          >
            <FiCopy />
          </button>

          <button
            onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
            className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
          >
            {theme === "vs-dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="relative z-10 flex-1 grid grid-cols-[1fr_420px] gap-4 p-4 overflow-hidden">
        {/* EDITOR */}
        <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
          <div className="h-12 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <span className="text-xs text-zinc-400">
                live-main.{extensions[language]}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <FiCode />
              {isTrainer ? "Editable by trainer" : "Read only for students"}
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme={theme}
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 15,
                minimap: { enabled: false },
                readOnly: !isTrainer,
                wordWrap: "on",
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                padding: { top: 18 },
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="font-black text-lg">
              Live Session Console
            </h2>

            <p className="text-xs text-zinc-500 mt-1">
              {isTrainer
                ? "Your input/output is shared live with students."
                : "Watch trainer code and output in real time."}
            </p>
          </div>

          <div className="flex-1 grid grid-rows-2">
            <div className="border-b border-zinc-800 flex flex-col">
              <div className="h-11 flex items-center justify-between px-4 bg-zinc-900/40 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <FiTerminal className="text-cyan-400" />
                  <span className="text-sm font-semibold">Input</span>
                </div>

                <span className="text-xs text-zinc-500">stdin</span>
              </div>

              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                readOnly={!isTrainer}
                placeholder={
                  isTrainer
                    ? "Enter input here..."
                    : "Trainer input will appear here..."
                }
                className="flex-1 resize-none outline-none bg-black text-zinc-300 text-sm p-4 font-mono disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col">
              <div className="h-11 flex items-center justify-between px-4 bg-zinc-900/40 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <FiTerminal className="text-green-400" />
                  <span className="text-sm font-semibold">Output</span>
                </div>

                <span className="text-xs text-zinc-500">terminal</span>
              </div>

              <pre className="flex-1 overflow-auto bg-black text-green-400 text-sm p-4 font-mono whitespace-pre-wrap">
                {output || "Output will appear here..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}