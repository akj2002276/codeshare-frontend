import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiFolder,
  FiFile,
  FiPlus,
  FiCopy,
  FiMoon,
  FiSun,
  FiZoomIn,
  FiZoomOut,
  FiTrash2,
  FiExternalLink,
  FiCode,
  FiCpu,
  FiX,
} from "react-icons/fi";

import Editor from "@monaco-editor/react";

import API from "../api/axios";
import socket from "../socket";

export default function Workspace() {
  const { batchId } = useParams();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [topics, setTopics] = useState([]);
  const [files, setFiles] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [code, setCode] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(15);

  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showCompilerPopup, setShowCompilerPopup] = useState(true);

  const [topicName, setTopicName] = useState("");

  const [fileData, setFileData] = useState({
    fileName: "",
    language: "javascript",
  });

  const saveTimeout = useRef(null);

  const fetchTopics = async () => {
    try {
      const res = await API.get(`/topics/${batchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTopics(res.data || []);
    } catch (error) {
      console.log("FETCH TOPICS ERROR:", error?.response?.data || error.message);
    }
  };

  const fetchFiles = async (topic) => {
    try {
      setSelectedTopic(topic);

      const res = await API.get(`/files/topic/${topic._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles(res.data || []);
    } catch (error) {
      console.log("FETCH FILES ERROR:", error?.response?.data || error.message);
    }
  };

  const openFile = async (fileId) => {
    try {
      const res = await API.get(`/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedFile(res.data);
      setCode(res.data?.code || "");
    } catch (error) {
      console.log("OPEN FILE ERROR:", error?.response?.data || error.message);
    }
  };

  const autoSave = (value) => {
    setCode(value);

    if (user?.role !== "trainer" || !selectedFile) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        await API.put(
          `/files/${selectedFile._id}`,
          { code: value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log("AUTO SAVE ERROR:", error?.response?.data || error.message);
      }
    }, 1200);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code Copied");
  };

  const createTopic = async () => {
    try {
      if (!topicName) return alert("Enter topic name");

      const res = await API.post(
        "/topics",
        {
          topicName,
          batchId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newTopic = res.data.topic || res.data;

      setTopics((prev) => [...prev, newTopic]);
      setTopicName("");
      setShowTopicModal(false);
    } catch (error) {
      console.log("CREATE TOPIC ERROR:", error?.response?.data || error.message);
    }
  };

  const createFile = async () => {
    try {
      if (!selectedTopic) return alert("Select topic first");
      if (!fileData.fileName) return alert("Enter file name");

      const res = await API.post(
        "/files",
        {
          fileName: fileData.fileName,
          language: fileData.language,
          topicId: selectedTopic._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newFile = res.data.file || res.data;

      setFiles((prev) => [...prev, newFile]);

      setFileData({
        fileName: "",
        language: "javascript",
      });

      setShowFileModal(false);
    } catch (error) {
      console.log("CREATE FILE ERROR:", error?.response?.data || error.message);
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      await API.delete(`/topics/${topicId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTopics((prev) => prev.filter((t) => t._id !== topicId));

      if (selectedTopic?._id === topicId) {
        setSelectedTopic(null);
        setFiles([]);
        setSelectedFile(null);
        setCode("");
      }
    } catch (error) {
      console.log("DELETE TOPIC ERROR:", error?.response?.data || error.message);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await API.delete(`/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles((prev) => prev.filter((f) => f._id !== fileId));

      if (selectedFile?._id === fileId) {
        setSelectedFile(null);
        setCode("");
      }
    } catch (error) {
      console.log("DELETE FILE ERROR:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (batchId) fetchTopics();

    socket.emit("user-online", user?._id);

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    const timer = setTimeout(() => {
      setShowCompilerPopup(false);
    }, 5000);

    return () => {
      socket.off("online-users");
      clearTimeout(timer);
    };
  }, [batchId]);

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full" />

      <AnimatePresence>
        {showCompilerPopup && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.94 }}
            transition={{ duration: 0.35 }}
            className="fixed top-6 right-6 z-[100] w-[380px] rounded-[28px] border border-cyan-500/20 bg-zinc-950/90 backdrop-blur-2xl shadow-2xl shadow-cyan-500/20 p-5 overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />

            <button
              onClick={() => setShowCompilerPopup(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <FiX />
            </button>

            <div className="relative z-10 flex gap-4">
              <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <FiCpu className="text-cyan-400" size={24} />
              </div>

              <div>
                <h3 className="text-lg font-black">
                  New Compiler is Live 🚀
                </h3>

                <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                  Practice your own code in the new playground. Open it in a new tab and run Java, C++, Python and JavaScript.
                </p>

                <button
                  onClick={() => window.open("/practice", "_blank")}
                  className="mt-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold hover:opacity-90 transition"
                >
                  Go to Playground
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 h-full flex p-4 gap-4">
        <aside className="w-80 rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <FiCode className="text-cyan-400" size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Workspace
                </h1>

                <p className="text-xs text-zinc-500">
                  {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 rounded-2xl border border-green-500/10 bg-green-500/5 px-3 py-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-green-400 text-xs font-semibold">
                {onlineUsers.length} users online
              </p>
            </div>
          </div>

          {user?.role === "trainer" && (
            <div className="p-4 flex gap-3 border-b border-zinc-800">
              <button
                onClick={() => setShowTopicModal(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition"
              >
                <FiPlus />
                Topic
              </button>

              <button
                onClick={() => setShowFileModal(true)}
                disabled={!selectedTopic}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 p-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-40 transition"
              >
                <FiPlus />
                File
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3">
            {topics.length === 0 && (
              <div className="text-center text-zinc-600 text-sm mt-20">
                No topics yet
              </div>
            )}

            {topics.map((topic) => (
              <motion.div
                key={topic._id}
                whileHover={{ x: 3 }}
                className="mb-3"
              >
                <div className="relative group">
                  <div
                    onClick={() => fetchFiles(topic)}
                    className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition border ${
                      selectedTopic?._id === topic._id
                        ? "bg-cyan-500/10 border-cyan-500/40"
                        : "border-transparent hover:bg-zinc-900 hover:border-zinc-800"
                    }`}
                  >
                    <FiFolder className="text-cyan-400" />
                    <span className="text-sm font-semibold">
                      {topic.topicName}
                    </span>
                  </div>

                  {user?.role === "trainer" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTopic(topic._id);
                      }}
                      className="absolute right-3 top-3 text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>

                {selectedTopic?._id === topic._id && (
                  <div className="ml-6 mt-2 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file._id}
                        className={`group p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-sm transition ${
                          selectedFile?._id === file._id
                            ? "bg-zinc-800 text-white"
                            : "hover:bg-zinc-900 text-zinc-400"
                        }`}
                      >
                        <div
                          onClick={() => openFile(file._id)}
                          className="flex items-center gap-2 flex-1"
                        >
                          <FiFile />
                          {file.fileName}
                        </div>

                        {user?.role === "trainer" && (
                          <button
                            onClick={() => deleteFile(file._id)}
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </aside>

        <main className="flex-1 rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
          <div className="h-16 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between px-5">
            <div>
              <h2 className="font-bold text-sm">
                {selectedFile ? selectedFile.fileName : "No File Selected"}
              </h2>

              <p className="text-xs text-zinc-500 mt-1">
                {selectedFile
                  ? `${selectedFile.language} • ${user?.role === "trainer" ? "Editable" : "Read only"}`
                  : "Choose a file from explorer"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedFile && (
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => window.open("/practice", "_blank")}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition flex items-center gap-2 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  <FiExternalLink />
                  Practice This Code
                </motion.button>
              )}

              <button
                onClick={copyCode}
                className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              >
                <FiCopy />
              </button>

              <button
                onClick={() => setFontSize((prev) => prev + 1)}
                className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              >
                <FiZoomIn />
              </button>

              <button
                onClick={() => setFontSize((prev) => prev - 1)}
                className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              >
                <FiZoomOut />
              </button>

              <button
                onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
                className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              >
                {theme === "vs-dark" ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>

          <div className="flex-1">
            {selectedFile ? (
              <Editor
                height="100%"
                theme={theme}
                language={selectedFile?.language || "javascript"}
                value={code}
                onChange={autoSave}
                options={{
                  fontSize,
                  minimap: { enabled: false },
                  readOnly: user?.role !== "trainer",
                  wordWrap: "on",
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 18 },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-[28px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                    <FiFile className="text-cyan-400" size={32} />
                  </div>

                  <h3 className="text-xl font-black">
                    Select a file to view code
                  </h3>

                  <p className="text-zinc-500 text-sm mt-2">
                    Open any topic from the sidebar and choose a file.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showTopicModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-950 p-7 rounded-[32px] w-[420px] border border-zinc-800 shadow-2xl"
          >
            <h2 className="text-2xl font-black mb-2">Create Topic</h2>
            <p className="text-xs text-zinc-500 mb-6">
              Add a new learning folder inside this batch.
            </p>

            <input
              type="text"
              placeholder="Topic Name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 outline-none text-sm focus:border-cyan-500"
            />

            <div className="flex gap-4">
              <button
                onClick={createTopic}
                className="flex-1 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl text-sm font-bold"
              >
                Create
              </button>

              <button
                onClick={() => setShowTopicModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showFileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-950 p-7 rounded-[32px] w-[420px] border border-zinc-800 shadow-2xl"
          >
            <h2 className="text-2xl font-black mb-2">Create File</h2>
            <p className="text-xs text-zinc-500 mb-6">
              Add a new code file inside the selected topic.
            </p>

            <input
              type="text"
              placeholder="File Name"
              value={fileData.fileName}
              onChange={(e) =>
                setFileData({
                  ...fileData,
                  fileName: e.target.value,
                })
              }
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 outline-none text-sm focus:border-cyan-500"
            />

            <select
              value={fileData.language}
              onChange={(e) =>
                setFileData({
                  ...fileData,
                  language: e.target.value,
                })
              }
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 outline-none text-sm focus:border-cyan-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>

            <div className="flex gap-4">
              <button
                onClick={createFile}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 p-4 rounded-2xl text-sm font-bold"
              >
                Create
              </button>

              <button
                onClick={() => setShowFileModal(false)}
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