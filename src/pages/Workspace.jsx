import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

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
} from "react-icons/fi";

import Editor from "@monaco-editor/react";

import API from "../api/axios";
import socket from "../socket";

export default function Workspace() {
  const { batchId } = useParams();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [topics, setTopics] = useState([]);
  const [files, setFiles] = useState([]);

  const [selectedTopic, setSelectedTopic] =
    useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [code, setCode] = useState("");

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [theme, setTheme] =
    useState("vs-dark");

  const [fontSize, setFontSize] =
    useState(16);

  const [showTopicModal, setShowTopicModal] =
    useState(false);

  const [showFileModal, setShowFileModal] =
    useState(false);

  const [topicName, setTopicName] =
    useState("");

  const [fileData, setFileData] =
    useState({
      fileName: "",
      language: "javascript",
    });

  const saveTimeout = useRef(null);

  const fetchTopics = async () => {
    try {
      const res = await API.get(
        `/topics/${batchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopics(res.data || []);
    } catch (error) {
      console.log(
        "FETCH TOPICS ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  const fetchFiles = async (topic) => {
    try {
      setSelectedTopic(topic);

      const res = await API.get(
        `/files/topic/${topic._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFiles(res.data || []);
    } catch (error) {
      console.log(
        "FETCH FILES ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  const openFile = async (fileId) => {
    try {
      const res = await API.get(
        `/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedFile(res.data);
      setCode(res.data?.code || "");
    } catch (error) {
      console.log(
        "OPEN FILE ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  const autoSave = (value) => {
    setCode(value);

    if (
      user?.role !== "trainer" ||
      !selectedFile
    ) {
      return;
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current =
      setTimeout(async () => {
        try {
          await API.put(
            `/files/${selectedFile._id}`,
            {
              code: value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log(
            "AUTO SAVE ERROR:",
            error?.response?.data || error.message
          );
        }
      }, 1200);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code Copied");
  };

  const createTopic = async () => {
    try {
      if (!topicName) {
        return alert("Enter topic name");
      }

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

      const newTopic =
        res.data.topic || res.data;

      setTopics((prev) => [
        ...prev,
        newTopic,
      ]);

      setTopicName("");
      setShowTopicModal(false);
    } catch (error) {
      console.log(
        "CREATE TOPIC ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  const createFile = async () => {
    try {
      if (!selectedTopic) {
        return alert("Select topic first");
      }

      if (!fileData.fileName) {
        return alert("Enter file name");
      }

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

      const newFile =
        res.data.file || res.data;

      setFiles((prev) => [
        ...prev,
        newFile,
      ]);

      setFileData({
        fileName: "",
        language: "javascript",
      });

      setShowFileModal(false);
    } catch (error) {
      console.log(
        "CREATE FILE ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      await API.delete(
        `/topics/${topicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopics((prev) =>
        prev.filter(
          (t) => t._id !== topicId
        )
      );

      if (
        selectedTopic?._id === topicId
      ) {
        setSelectedTopic(null);
        setFiles([]);
        setSelectedFile(null);
        setCode("");
      }
    } catch (error) {
      console.log(
        "DELETE TOPIC ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await API.delete(
        `/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFiles((prev) =>
        prev.filter(
          (f) => f._id !== fileId
        )
      );

      if (
        selectedFile?._id === fileId
      ) {
        setSelectedFile(null);
        setCode("");
      }
    } catch (error) {
      console.log(
        "DELETE FILE ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchTopics();
    }

    socket.emit(
      "user-online",
      user?._id
    );

    socket.on(
      "online-users",
      (users) => {
        setOnlineUsers(users);
      }
    );

    return () => {
      socket.off("online-users");
    };
  }, [batchId]);

  return (
    <div className="h-screen flex bg-black text-white">

      {/* SIDEBAR */}
      <div className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b border-zinc-800">

          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Workspace
          </h1>

          <p className="text-zinc-500 mt-1">
            {user?.name}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

            <p className="text-green-400 text-sm font-medium">
              {onlineUsers.length} Users Online
            </p>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        {user?.role === "trainer" && (
          <div className="p-4 flex gap-3 border-b border-zinc-800">

            <button
              onClick={() =>
                setShowTopicModal(true)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FiPlus />
              Topic
            </button>

            <button
              onClick={() =>
                setShowFileModal(true)
              }
              disabled={!selectedTopic}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 p-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiPlus />
              File
            </button>

          </div>
        )}

        {/* TOPICS */}
        <div className="flex-1 overflow-y-auto p-3">

          {topics.map((topic) => (
            <motion.div
              key={topic._id}
              whileHover={{ x: 3 }}
              className="mb-3"
            >

              <div className="relative group">

                <div
                  onClick={() =>
                    fetchFiles(topic)
                  }
                  className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition ${
                    selectedTopic?._id === topic._id
                      ? "bg-cyan-500/20 border border-cyan-500"
                      : "hover:bg-zinc-800"
                  }`}
                >
                  <FiFolder className="text-cyan-400" />
                  {topic.topicName}
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

              {selectedTopic?._id ===
                topic._id && (
                <div className="ml-6 mt-2 space-y-2">

                  {files.map((file) => (
                    <div
                      key={file._id}
                      className={`group p-2 rounded-lg cursor-pointer flex items-center justify-between text-sm ${
                        selectedFile?._id === file._id
                          ? "bg-zinc-700"
                          : "hover:bg-zinc-800"
                      }`}
                    >

                      <div
                        onClick={() =>
                          openFile(file._id)
                        }
                        className="flex items-center gap-2 flex-1"
                      >
                        <FiFile />
                        {file.fileName}
                      </div>

                      {user?.role ===
                        "trainer" && (
                        <button
                          onClick={() =>
                            deleteFile(file._id)
                          }
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

      </div>

      {/* EDITOR */}
      <div className="flex-1 flex flex-col">

        {/* TOOLBAR */}
        <div className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-5">

          <h2 className="font-bold text-lg">
            {selectedFile
              ? selectedFile.fileName
              : "No File Selected"}
          </h2>

          <div className="flex items-center gap-3">

            {/* PRACTICE BUTTON */}
            {selectedFile && (
              <button
                onClick={() =>
                  window.open(
                    "/practice",
                    "_blank"
                  )
                }
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition flex items-center gap-2 font-semibold text-sm shadow-lg shadow-cyan-500/20"
              >
                <FiExternalLink />
                Practice This Code
              </button>
            )}

            {/* COPY */}
            <button
              onClick={copyCode}
              className="p-2 rounded-lg hover:bg-zinc-800"
            >
              <FiCopy />
            </button>

            {/* FONT + */}
            <button
              onClick={() =>
                setFontSize(
                  (prev) => prev + 1
                )
              }
              className="p-2 rounded-lg hover:bg-zinc-800"
            >
              <FiZoomIn />
            </button>

            {/* FONT - */}
            <button
              onClick={() =>
                setFontSize(
                  (prev) => prev - 1
                )
              }
              className="p-2 rounded-lg hover:bg-zinc-800"
            >
              <FiZoomOut />
            </button>

            {/* THEME */}
            <button
              onClick={() =>
                setTheme(
                  theme === "vs-dark"
                    ? "light"
                    : "vs-dark"
                )
              }
              className="p-2 rounded-lg hover:bg-zinc-800"
            >
              {theme === "vs-dark" ? (
                <FiSun />
              ) : (
                <FiMoon />
              )}
            </button>

          </div>

        </div>

        {/* EDITOR */}
        <div className="flex-1">

          <Editor
            height="100%"
            theme={theme}
            language={
              selectedFile?.language ||
              "javascript"
            }
            value={code}
            onChange={autoSave}
            options={{
              fontSize,
              minimap: {
                enabled: false,
              },
              readOnly:
                user?.role !== "trainer",
            }}
          />

        </div>

      </div>

      {/* TOPIC MODAL */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-zinc-900 p-8 rounded-3xl w-[400px] border border-zinc-800">

            <h2 className="text-2xl font-bold mb-6">
              Create Topic
            </h2>

            <input
              type="text"
              placeholder="Topic Name"
              value={topicName}
              onChange={(e) =>
                setTopicName(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mb-6 outline-none"
            />

            <div className="flex gap-4">

              <button
                onClick={createTopic}
                className="flex-1 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl"
              >
                Create
              </button>

              <button
                onClick={() =>
                  setShowTopicModal(false)
                }
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 p-4 rounded-2xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* FILE MODAL */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-zinc-900 p-8 rounded-3xl w-[400px] border border-zinc-800">

            <h2 className="text-2xl font-bold mb-6">
              Create File
            </h2>

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
              className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mb-4 outline-none"
            />

            <select
              value={fileData.language}
              onChange={(e) =>
                setFileData({
                  ...fileData,
                  language: e.target.value,
                })
              }
              className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mb-6 outline-none"
            >
              <option value="javascript">
                JavaScript
              </option>

              <option value="java">
                Java
              </option>

              <option value="cpp">
                C++
              </option>

              <option value="python">
                Python
              </option>
            </select>

            <div className="flex gap-4">

              <button
                onClick={createFile}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 p-4 rounded-2xl"
              >
                Create
              </button>

              <button
                onClick={() =>
                  setShowFileModal(false)
                }
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 p-4 rounded-2xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}