import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiSend,
  FiUsers,
  FiMessageCircle,
  FiLock,
  FiUserX,
  FiRefreshCcw,
  FiX,
  FiShield,
  FiRadio,
  FiTrash2,
} from "react-icons/fi";

import API from "../api/axios";
import socket from "../socket";

export default function Community() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isTrainer = user?.role === "trainer";

  const [joined, setJoined] = useState(false);
  const [member, setMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [blockReason, setBlockReason] = useState("");

  const messagesEndRef = useRef(null);

  const fetchMe = async () => {
    const res = await API.get("/community/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setJoined(res.data.joined);
    setMember(res.data.member);
  };

  const fetchMessages = async () => {
    const res = await API.get("/community/messages", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages(res.data || []);
  };

  const fetchMembers = async () => {
    if (!isTrainer) return;

    const res = await API.get("/community/members", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMembers(res.data || []);
  };

  const joinCommunity = async () => {
    try {
      const res = await API.post(
        "/community/join",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJoined(true);
      setMember(res.data.member);

      socket.emit("community-join", {
        name: user?.name,
        email: user?.email,
        role: user?.role,
      });

      fetchMessages();
      fetchMembers();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to join community");
    }
  };

  const sendMessage = async () => {
    try {
      if (!message.trim()) return;

      const res = await API.post(
        "/community/messages",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMessage = res.data.communityMessage;

      setMessages((prev) => [...prev, newMessage]);
      socket.emit("community-message-send", newMessage);
      setMessage("");
    } catch (error) {
      if (error?.response?.data?.blockReason) {
        alert(`You are blocked: ${error.response.data.blockReason}`);
      } else {
        alert(error?.response?.data?.message || "Failed to send message");
      }

      fetchMe();
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await API.delete(`/community/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete message");
    }
  };

  const clearChat = async () => {
    try {
      const confirmClear = window.confirm(
        "Are you sure you want to clear all community messages?"
      );

      if (!confirmClear) return;

      await API.delete("/community/messages/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages([]);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to clear chat");
    }
  };

  const openBlockModal = (student) => {
    setSelectedMember(student);
    setBlockReason("");
    setBlockModal(true);
  };

  const blockUser = async () => {
    try {
      if (!blockReason.trim()) return alert("Enter block reason");

      await API.patch(
        `/community/block/${selectedMember.user._id || selectedMember.user}`,
        { reason: blockReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("community-user-blocked", {
        studentId: selectedMember.user._id || selectedMember.user,
        reason: blockReason,
      });

      setBlockModal(false);
      setSelectedMember(null);
      setBlockReason("");
      fetchMembers();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to block student");
    }
  };

  const unblockUser = async (student) => {
    try {
      await API.patch(
        `/community/unblock/${student.user._id || student.user}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("community-user-unblocked", {
        studentId: student.user._id || student.user,
      });

      fetchMembers();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to unblock student");
    }
  };

  useEffect(() => {
    fetchMe();
    fetchMessages();
    fetchMembers();

    socket.on("community-new-message", (newMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === newMessage._id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    });

    socket.on("community-member-joined", fetchMembers);

    socket.on("community-user-blocked-update", (data) => {
      if (data.studentId === user?._id) fetchMe();
      fetchMembers();
    });

    socket.on("community-user-unblocked-update", (data) => {
      if (data.studentId === user?._id) fetchMe();
      fetchMembers();
    });

    return () => {
      socket.off("community-new-message");
      socket.off("community-member-joined");
      socket.off("community-user-blocked-update");
      socket.off("community-user-unblocked-update");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  if (!joined) {
    return (
      <div className="h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <div className="absolute -top-40 -left-40 w-[560px] h-[560px] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] bg-blue-600/10 blur-[150px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-[560px] rounded-[40px] border border-cyan-500/20 bg-zinc-950/80 backdrop-blur-2xl p-9 shadow-2xl shadow-cyan-500/10 text-center overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-cyan-500/20 blur-3xl rounded-full" />

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10 w-24 h-24 mx-auto rounded-[32px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-7 shadow-xl shadow-cyan-500/20"
          >
            <FiMessageCircle className="text-cyan-400" size={40} />
          </motion.div>

          <h1 className="relative z-10 text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Join CodeShareX Community
          </h1>

          <p className="relative z-10 text-sm text-zinc-400 leading-relaxed mb-8">
            Enter the announcement group and discussion room. Chat with peers,
            ask doubts, and stay connected with your coding community.
          </p>

          <button
            onClick={joinCommunity}
            className="relative z-10 w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-black text-sm shadow-xl shadow-cyan-500/20"
          >
            Join Now
          </button>
        </motion.div>
      </div>
    );
  }

  const isBlocked = member?.isBlocked;

  return (
    <div className="h-screen max-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[560px] h-[560px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] bg-blue-600/10 blur-[150px] rounded-full" />

      <div className="relative z-10 h-screen max-h-screen p-5 flex gap-5 overflow-hidden">
        <main className="h-[calc(100vh-40px)] min-h-0 flex-1 rounded-[36px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-cyan-500/5 flex flex-col">
          <div className="shrink-0 p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(34,211,238,0.2)",
                    "0 0 28px rgba(34,211,238,0.25)",
                    "0 0 0px rgba(34,211,238,0.2)",
                  ],
                }}
                transition={{ duration: 2.6, repeat: Infinity }}
                className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
              >
                <FiRadio className="text-cyan-400" size={23} />
              </motion.div>

              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Announcement Group
                </h1>

                <p className="text-xs text-zinc-500">
                  Live community room • Text-only chat
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-bold">
                  Live
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isTrainer && (
                <>
                  <button
                    onClick={clearChat}
                    className="px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-bold flex items-center gap-2"
                  >
                    <FiTrash2 />
                    Clear Chat
                  </button>

                  <button
                    onClick={() => setShowMembers(true)}
                    className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-bold flex items-center gap-2"
                  >
                    <FiUsers />
                    {members.length} Joined
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  fetchMessages();
                  fetchMe();
                  fetchMembers();
                }}
                className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              >
                <FiRefreshCcw />
              </button>
            </div>
          </div>

          {isBlocked && (
            <div className="shrink-0 m-5 rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
              <div className="flex items-start gap-3">
                <FiLock className="text-red-400 mt-1" />

                <div>
                  <h3 className="text-sm font-black text-red-300">
                    You are blocked from sending messages
                  </h3>

                  <p className="text-xs text-red-200/80 mt-2">
                    Reason: {member?.blockReason || "No reason provided"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 max-h-full overflow-y-auto p-5 space-y-4 overscroll-contain">
            {messages.length === 0 && (
              <p className="text-center text-zinc-600 mt-20">
                No messages yet. Start the conversation.
              </p>
            )}

            {messages.map((msg) => {
              const isMine = msg.sender === user?._id;

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`group relative max-w-[72%] rounded-[28px] border p-4 shadow-xl ${
                      isMine
                        ? "bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/5"
                        : "bg-zinc-900/90 border-zinc-800 shadow-black/30"
                    }`}
                  >
                    {isTrainer && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white hidden group-hover:flex items-center justify-center shadow-lg"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black text-white">
                        {msg.senderName}
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          msg.senderRole === "trainer"
                            ? "bg-yellow-500/10 text-yellow-300"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {msg.senderRole}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed break-words">
                      {msg.message}
                    </p>

                    <p className="text-[10px] text-zinc-600 mt-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 p-5 border-t border-zinc-800 bg-zinc-900/60">
            <div className="flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isBlocked}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder={
                  isBlocked
                    ? "You are blocked from sending messages"
                    : "Type your message..."
                }
                className="flex-1 p-4 rounded-2xl bg-black/60 border border-zinc-800 outline-none text-sm focus:border-cyan-500 disabled:opacity-50"
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={sendMessage}
                disabled={isBlocked}
                className="px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-black text-sm flex items-center gap-2 disabled:opacity-50 shadow-xl shadow-cyan-500/20"
              >
                <FiSend />
                Send
              </motion.button>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {showMembers && isTrainer && (
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="h-[calc(100vh-40px)] min-h-0 w-[390px] rounded-[36px] border border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="shrink-0 p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Joined Students</h2>

                  <p className="text-xs text-zinc-500">
                    {members.length} members joined
                  </p>
                </div>

                <button
                  onClick={() => setShowMembers(false)}
                  className="p-2 rounded-xl hover:bg-zinc-800"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
                {members.map((student) => (
                  <motion.div
                    key={student._id}
                    whileHover={{ x: 3 }}
                    className={`rounded-3xl border p-4 ${
                      student.isBlocked
                        ? "border-red-500/20 bg-red-500/5"
                        : "border-zinc-800 bg-black/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold">{student.name}</h3>

                        <p className="text-xs text-zinc-500 mt-1">
                          {student.email}
                        </p>

                        <p className="text-[10px] text-zinc-600 mt-2">
                          Joined: {new Date(student.joinedAt).toLocaleString()}
                        </p>

                        {student.isBlocked && (
                          <p className="text-xs text-red-300 mt-2">
                            Blocked: {student.blockReason}
                          </p>
                        )}
                      </div>

                      <span
                        className={`text-[10px] px-2 py-1 rounded-full ${
                          student.role === "trainer"
                            ? "bg-yellow-500/10 text-yellow-300"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {student.role}
                      </span>
                    </div>

                    {student.role !== "trainer" && (
                      <div className="mt-4">
                        {student.isBlocked ? (
                          <button
                            onClick={() => unblockUser(student)}
                            className="w-full p-3 rounded-2xl bg-green-600 hover:bg-green-700 text-xs font-black"
                          >
                            Unblock Student
                          </button>
                        ) : (
                          <button
                            onClick={() => openBlockModal(student)}
                            className="w-full p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-xs font-black flex items-center justify-center gap-2"
                          >
                            <FiUserX />
                            Block Student
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {blockModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-[430px] bg-zinc-950 border border-zinc-800 rounded-[32px] p-7 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <FiShield className="text-red-400" size={24} />
            </div>

            <h2 className="text-2xl font-black mb-2">Block Student</h2>

            <p className="text-xs text-zinc-500 mb-5">
              This reason will be visible to the student.
            </p>

            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Reason for blocking..."
              className="w-full h-32 resize-none p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-5 outline-none text-sm focus:border-red-500"
            />

            <div className="flex gap-4">
              <button
                onClick={blockUser}
                className="flex-1 p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-sm font-black"
              >
                Block
              </button>

              <button
                onClick={() => {
                  setBlockModal(false);
                  setSelectedMember(null);
                  setBlockReason("");
                }}
                className="flex-1 p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-sm font-black"
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