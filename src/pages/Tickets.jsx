import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

import {
  FiRefreshCcw,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiUser,
} from "react-icons/fi";

import API from "../api/axios";

export default function Tickets() {
  const token = localStorage.getItem("token");

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolvedCode, setResolvedCode] = useState("");
  const [trainerFeedback, setTrainerFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets(res.data || []);
    } catch (error) {
      console.log("FETCH TICKETS ERROR:", error);
    }
  };

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setResolvedCode(ticket.resolvedCode || ticket.originalCode || "");
    setTrainerFeedback(ticket.trainerFeedback || "");
  };

  const resolveTicket = async () => {
    try {
      if (!selectedTicket) return;

      setLoading(true);

      const res = await API.patch(
        `/tickets/${selectedTicket._id}/resolve`,
        {
          resolvedCode,
          trainerFeedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedTicket(res.data.ticket);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id ? res.data.ticket : ticket
        )
      );

      alert("Ticket resolved successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to resolve ticket");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await API.delete(`/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets((prev) => prev.filter((ticket) => ticket._id !== ticketId));

      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(null);
        setResolvedCode("");
        setTrainerFeedback("");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete ticket");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const pendingCount = tickets.filter(
    (ticket) => ticket.status === "pending"
  ).length;

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-blue-600/10 blur-[150px] rounded-full" />

      <div className="relative z-10 h-full p-5 flex gap-5">
        {/* LEFT TICKET LIST */}
        <aside className="w-[390px] rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl">
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Active Tickets
                </h1>

                <p className="text-xs text-zinc-500 mt-1">
                  Resolve student code doubts
                </p>
              </div>

              <button
                onClick={fetchTickets}
                className="p-2.5 rounded-xl hover:bg-zinc-800 border border-zinc-800"
              >
                <FiRefreshCcw />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="text-2xl font-black">{pendingCount}</p>
                <p className="text-xs text-yellow-300">Pending</p>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-2xl font-black">{tickets.length}</p>
                <p className="text-xs text-green-400">Total</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {tickets.length === 0 && (
              <p className="text-sm text-zinc-600 text-center mt-20">
                No tickets yet
              </p>
            )}

            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                whileHover={{ x: 3 }}
                onClick={() => openTicket(ticket)}
                className={`relative cursor-pointer rounded-3xl border p-4 transition ${
                  selectedTicket?._id === ticket._id
                    ? "border-cyan-500/50 bg-cyan-500/10"
                    : ticket.status === "resolved"
                    ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
                    : "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40"
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTicket(ticket._id);
                  }}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                >
                  <FiTrash2 />
                </button>

                <div className="pr-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <FiUser className="text-cyan-400" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">{ticket.studentName}</h3>

                      <p className="text-xs text-zinc-500">
                        {ticket.studentEmail}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold mb-2">
                    {ticket.title}
                  </h4>

                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {ticket.doubt}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {ticket.language}
                    </span>

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

                  <p className="text-[10px] text-zinc-600 mt-3">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </aside>

        {/* RIGHT DETAIL PANEL */}
        <main className="flex-1 rounded-[32px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
          {!selectedTicket ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-[28px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                  <FiCheckCircle className="text-cyan-400" size={34} />
                </div>

                <h2 className="text-2xl font-black">
                  Select a ticket
                </h2>

                <p className="text-zinc-500 text-sm mt-2">
                  Open a student doubt and resolve their code.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    {selectedTicket.title}
                  </h2>

                  <p className="text-xs text-zinc-500 mt-1">
                    {selectedTicket.studentName} • {selectedTicket.studentEmail}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    selectedTicket.status === "resolved"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-300"
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
                {/* ORIGINAL */}
                <div className="border-r border-zinc-800 flex flex-col">
                  <div className="p-4 border-b border-zinc-800 bg-zinc-900/40">
                    <h3 className="text-sm font-bold">Student Code</h3>

                    <p className="text-xs text-zinc-500 mt-1">
                      Language: {selectedTicket.language}
                    </p>
                  </div>

                  <div className="flex-1">
                    <Editor
                      height="100%"
                      theme="vs-dark"
                      language={
                        selectedTicket.language === "cpp"
                          ? "cpp"
                          : selectedTicket.language
                      }
                      value={selectedTicket.originalCode}
                      options={{
                        fontSize: 14,
                        readOnly: true,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>

                  <div className="p-4 border-t border-zinc-800 bg-black/40">
                    <h3 className="text-sm font-bold mb-2">
                      Student Doubt
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {selectedTicket.doubt}
                    </p>
                  </div>
                </div>

                {/* RESOLVE */}
                <div className="flex flex-col">
                  <div className="p-4 border-b border-zinc-800 bg-zinc-900/40">
                    <h3 className="text-sm font-bold">Resolved Code</h3>

                    <p className="text-xs text-zinc-500 mt-1">
                      Edit and submit fixed version
                    </p>
                  </div>

                  <div className="flex-1">
                    <Editor
                      height="100%"
                      theme="vs-dark"
                      language={
                        selectedTicket.language === "cpp"
                          ? "cpp"
                          : selectedTicket.language
                      }
                      value={resolvedCode}
                      onChange={(value) => setResolvedCode(value || "")}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>

                  <div className="p-4 border-t border-zinc-800 bg-black/40">
                    <textarea
                      value={trainerFeedback}
                      onChange={(e) => setTrainerFeedback(e.target.value)}
                      placeholder="Add trainer feedback..."
                      className="w-full h-24 resize-none p-4 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none text-sm focus:border-cyan-500 mb-4"
                    />

                    <button
                      onClick={resolveTicket}
                      disabled={loading}
                      className="w-full p-4 rounded-2xl bg-green-600 hover:bg-green-700 text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FiCheckCircle />
                      {loading ? "Resolving..." : "Mark as Resolved"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}